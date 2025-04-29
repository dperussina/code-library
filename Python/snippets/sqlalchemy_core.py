from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

def create_db_engine(db_url: str = "sqlite:///./my_database.db"):
    """Creates a SQLAlchemy engine."""
    try:
        engine = create_engine(db_url, echo=False, future=True)
        print(f"Database engine created for {db_url}")
        return engine
    except SQLAlchemyError as e:
        print(f"Error creating database engine: {e}")
        return None

def execute_sql(engine, sql_query: str, params: dict | None = None):
    """Executes a SQL query using the engine and returns results if any."""
    try:
        with engine.connect() as connection:
            result = connection.execute(text(sql_query), params or {})
            if result.returns_rows:
                return result.fetchall()
            return None
    except SQLAlchemyError as e:
        print(f"Error executing SQL query: {e}")
        return None