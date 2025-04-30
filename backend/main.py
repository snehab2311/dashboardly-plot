from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from models import SessionLocal, FileAnalysis, Base, engine
import json
from datetime import datetime
from fastapi.responses import JSONResponse
import numpy as np
import io

def convert_to_serializable(obj):
    if isinstance(obj, (pd.Timestamp, datetime)):
        return obj.isoformat()
    elif isinstance(obj, (np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.float64, np.float32)):
        return float(obj)
    elif pd.isna(obj):
        return None
    return obj

def serialize_dataframe_dict(d):
    if isinstance(d, dict):
        return {k: serialize_dataframe_dict(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [serialize_dataframe_dict(v) for v in d]
    return convert_to_serializable(d)

def read_file_to_dataframe(file_content: bytes, file_extension: str) -> pd.DataFrame:
    """Read file content into a pandas DataFrame based on file type."""
    try:
        if file_extension == '.csv':
            df = pd.read_csv(io.StringIO(file_content.decode('utf-8')))
        elif file_extension in ['.xlsx', '.xls']:
            df = pd.read_excel(io.BytesIO(file_content))
            # Convert any empty strings to NaN for consistent handling
            df = df.replace(r'^\s*$', np.nan, regex=True)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        return df
    except Exception as e:
        raise ValueError(f"Error reading file: {str(e)}")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://localhost:3000", 
        "http://127.0.0.1:8080", 
        "http://127.0.0.1:3000",
        "https://dashboardly-plot.vercel.app"  # Added Vercel deployment URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
try:
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")
except Exception as e:
    print(f"Error initializing database: {str(e)}")

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    print(f"\n{'='*50}")
    print(f"New file upload request received at {datetime.now()}")
    print(f"Filename: {file.filename}")
    print(f"Content type: {file.content_type}")
    print(f"{'='*50}\n")
    
    # Check file extension
    file_extension = file.filename[file.filename.rfind('.'):].lower()
    if file_extension not in ['.csv', '.xlsx', '.xls']:
        error_msg = "File must be a CSV or Excel file (.xlsx, .xls)"
        print(f"Error: {error_msg}")
        return JSONResponse(
            status_code=400,
            content={"detail": error_msg}
        )
    
    db = None
    try:
        # Read the file content
        print("Reading file contents...")
        contents = await file.read()
        print(f"File size: {len(contents)} bytes")
        
        if len(contents) == 0:
            error_msg = "File is empty"
            print(f"Error: {error_msg}")
            return JSONResponse(
                status_code=400,
                content={"detail": error_msg}
            )
        
        # Clear previous data
        print("Connecting to database...")
        db = SessionLocal()
        try:
            print("Clearing previous analyses...")
            db.query(FileAnalysis).delete()
            db.commit()
            print("Cleared previous analyses from database")
        except Exception as e:
            error_msg = f"Database error: {str(e)}"
            print(f"Error: {error_msg}")
            db.rollback()
            return JSONResponse(
                status_code=500,
                content={"detail": error_msg}
            )
        
        # Read file into DataFrame
        try:
            print(f"Parsing {file_extension} file with pandas...")
            df = read_file_to_dataframe(contents, file_extension)
            
            # Try to convert date-like columns to datetime
            for col in df.columns:
                try:
                    if df[col].dtype == 'object':
                        pd.to_datetime(df[col], errors='raise')
                        df[col] = pd.to_datetime(df[col])
                        print(f"Converted column {col} to datetime")
                except:
                    continue
            
            print("File successfully read")
            print(f"Shape: {df.shape}")
            print(f"Columns: {list(df.columns)}")
        except Exception as e:
            print(f"Error reading file: {str(e)}")
            return JSONResponse(
                status_code=400,
                content={"detail": f"Error reading file: {str(e)}"}
            )

        # Calculate dataset info
        print("Calculating dataset info...")
        total_rows, total_cols = df.shape
        
        # Identify numeric columns (including those that can be converted to numeric)
        numeric_cols = []
        for col in df.columns:
            try:
                # Check if column is already numeric
                if pd.api.types.is_numeric_dtype(df[col]):
                    numeric_cols.append(col)
                    continue
                
                # Try converting to numeric if possible
                pd.to_numeric(df[col], errors='raise')
                numeric_cols.append(col)
            except:
                continue
        numeric_cols = list(set(numeric_cols))
        
        # Identify date columns
        date_cols = []
        for col in df.columns:
            if col not in numeric_cols:  # Skip already identified numeric columns
                try:
                    if pd.api.types.is_datetime64_any_dtype(df[col]):
                        date_cols.append(col)
                    else:
                        # Try converting to datetime
                        pd.to_datetime(df[col], errors='raise')
                        date_cols.append(col)
                except:
                    continue
        date_cols = list(set(date_cols))
        
        # Identify categorical columns
        remaining_cols = [col for col in df.columns if col not in numeric_cols + date_cols]
        categorical_cols = []
        for col in remaining_cols:
            unique_ratio = df[col].nunique() / len(df)
            if unique_ratio < 0.5:  # If less than 50% unique values, consider it categorical
                categorical_cols.append(col)
        
        # Calculate missing values accurately
        null_counts = df.isnull().sum()
        missing_values = null_counts.sum()
        missing_percentage = (missing_values / (total_rows * total_cols)) * 100
        
        # Calculate duplicate rows
        duplicate_mask = df.duplicated()
        duplicate_rows = duplicate_mask.sum()
        
        print("\nAnalysis Summary:")
        print(f"Total Rows: {total_rows}")
        print(f"Total Columns: {total_cols}")
        print(f"Missing Values: {missing_values}")
        print(f"Duplicate Rows: {duplicate_rows}")
        print(f"Numeric Columns ({len(numeric_cols)}): {numeric_cols}")
        print(f"Categorical Columns ({len(categorical_cols)}): {categorical_cols}")
        print(f"Date Columns ({len(date_cols)}): {date_cols}")
        
        # Perform EDA calculations
        try:
            print("\nPerforming EDA calculations...")
            # Convert head data to serializable format
            head_data = serialize_dataframe_dict(df.head().to_dict(orient='records'))
            
            # Handle numeric columns
            numeric_describe = {}
            if numeric_cols:
                numeric_df = df[numeric_cols].apply(pd.to_numeric, errors='coerce')
                numeric_describe = numeric_df.describe(include=[np.number]).to_dict()
            
            # Handle categorical columns
            categorical_describe = {}
            for col in categorical_cols:
                value_counts = df[col].value_counts(dropna=True)
                categorical_describe[col] = {
                    'count': int(df[col].count()),
                    'unique': int(df[col].nunique()),
                    'top': str(value_counts.index[0]) if not value_counts.empty else None,
                    'freq': int(value_counts.iloc[0]) if not value_counts.empty else 0,
                    'null_count': int(df[col].isnull().sum())
                }
            
            # Handle date columns
            date_describe = {}
            for col in date_cols:
                try:
                    date_series = pd.to_datetime(df[col], errors='coerce')
                    date_describe[col] = {
                        'min': date_series.min().isoformat() if pd.notnull(date_series.min()) else None,
                        'max': date_series.max().isoformat() if pd.notnull(date_series.max()) else None,
                        'unique': int(date_series.nunique()),
                        'null_count': int(date_series.isnull().sum())
                    }
                except:
                    continue
            
            # Combine descriptions and convert to serializable format
            describe_data = serialize_dataframe_dict({**numeric_describe, **categorical_describe})
            describe_data.update(date_describe)
            
            dtypes_data = df.dtypes.astype(str).to_dict()
            null_counts = serialize_dataframe_dict(df.isnull().sum().to_dict())
            
            print("EDA calculations completed")
            
        except Exception as e:
            print(f"Error in EDA calculations: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Error in data analysis: {str(e)}"}
            )
        
        # Save to database
        try:
            print("Saving to database...")
            file_analysis = FileAnalysis(
                filename=file.filename,
                upload_date=datetime.utcnow(),
                head_data=head_data,
                describe_data=describe_data,
                dtypes_data=dtypes_data,
                null_counts=null_counts
            )
            
            db.add(file_analysis)
            db.commit()
            db.refresh(file_analysis)
            print("Saved to database successfully")
            
            # Prepare response
            print("Generating insights...")
            
            # Generate insights
            insights = []
            recommendations = []
            
            # Analyze categorical columns
            if len(categorical_cols) > 0:
                for col in categorical_cols:
                    value_counts = df[col].value_counts()
                    top_value = value_counts.index[0]
                    top_percentage = (value_counts.iloc[0] / len(df)) * 100
                    
                    if top_percentage > 30:  # Significant dominance
                        insights.append({
                            "title": f"Dominant Category in {col}",
                            "description": f"'{top_value}' accounts for {top_percentage:.1f}% of values in {col}"
                        })
            
            # Analyze numeric columns
            if len(numeric_cols) > 0:
                for col in numeric_cols:
                    # Check for skewness
                    skewness = df[col].skew()
                    if abs(skewness) > 1:
                        insights.append({
                            "title": f"Distribution Pattern in {col}",
                            "description": f"The data is {'positively' if skewness > 0 else 'negatively'} skewed"
                        })
            
            # Add recommendations based on analysis
            if missing_values > 0:
                recommendations.append(
                    f"Consider handling {missing_values} missing values ({missing_percentage:.1f}% of total data)"
                )
            
            if duplicate_rows > 0:
                recommendations.append(
                    f"Review {duplicate_rows} duplicate rows ({(duplicate_rows/total_rows*100):.1f}% of data)"
                )
            
            # Calculate categorical distributions
            categorical_distributions = {}
            for col in categorical_cols:
                value_counts = df[col].value_counts(dropna=True)
                categorical_distributions[col] = value_counts.to_dict()

            response_data = {
                "dataset_info": {
                    "total_rows": total_rows,
                    "total_columns": total_cols,
                    "missing_values": int(missing_values),
                    "missing_percentage": f"{missing_percentage:.2f}%",
                    "duplicate_rows": int(duplicate_rows),
                    "numeric_columns": len(numeric_cols),
                    "categorical_columns": len(categorical_cols),
                    "date_columns": len(date_cols)
                },
                "describe": describe_data,
                "null_counts": null_counts,
                "insights": insights,
                "recommendations": recommendations,
                "categorical_distributions": categorical_distributions
            }
            
            print("Analysis complete")
            return JSONResponse(content=response_data)
            
        except Exception as e:
            print(f"Error saving to database: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Error saving analysis: {str(e)}"}
            )
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Unexpected error: {str(e)}"}
        )
        
    finally:
        if db:
            db.close()

@app.get("/analyses/")
async def get_analyses():
    db = SessionLocal()
    try:
        analyses = db.query(FileAnalysis).all()
        return analyses
    finally:
        db.close() 