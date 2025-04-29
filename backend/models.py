from sqlalchemy import Column, Integer, String, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

Base = declarative_base()

class FileAnalysis(Base):
    __tablename__ = "file_analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    head_data = Column(Text)  # Store as JSON string
    describe_data = Column(Text)  # Store as JSON string
    dtypes_data = Column(Text)  # Store as JSON string
    null_counts = Column(Text)  # Store as JSON string

    def __init__(self, filename, upload_date, head_data, describe_data, dtypes_data, null_counts):
        self.filename = filename
        self.upload_date = upload_date
        self.head_data = json.dumps(head_data)
        self.describe_data = json.dumps(describe_data)
        self.dtypes_data = json.dumps(dtypes_data)
        self.null_counts = json.dumps(null_counts)

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'upload_date': self.upload_date.isoformat(),
            'head_data': json.loads(self.head_data),
            'describe_data': json.loads(self.describe_data),
            'dtypes_data': json.loads(self.dtypes_data),
            'null_counts': json.loads(self.null_counts)
        }

# Create SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./csv_analysis.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine) 