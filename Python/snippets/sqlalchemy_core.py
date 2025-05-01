from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

def create_db_engine(db_url: str = "sqlite:///./my_database.db"):
    """Creates a SQLAlchemy engine, which is the starting point for any SQLAlchemy application.

    The engine manages connections to the database.

    Args:
        db_url: The database connection URL (e.g., "sqlite:///./my_database.db",
                "postgresql://user:password@host:port/database").

    Returns:
        A SQLAlchemy Engine object, or None if creation fails.
    """
    try:
        # Create the engine using the database URL.
        # echo=False: Disables logging of SQL statements executed.
        # future=True: Enables 2.0 style usage (recommended).
        engine = create_engine(db_url, echo=False, future=True)
        # Confirm engine creation.
        print(f"Database engine created successfully for: {engine.url}")
        return engine
    except SQLAlchemyError as e:
        # Handle errors during engine creation (e.g., invalid URL, database driver issues).
        print(f"Error creating database engine for {db_url}: {e}")
        return None

def execute_sql(engine, sql_query: str, params: dict | None = None):
    """Executes a SQL query using the provided SQLAlchemy engine.

    Handles both queries that return rows (SELECT) and those that don't (INSERT, UPDATE, DELETE).

    Args:
        engine: The SQLAlchemy Engine object to use for connecting.
        sql_query: The raw SQL query string to execute.
                   Use parameter placeholders (e.g., :param_name) for safety.
        params: An optional dictionary of parameters to bind to the query.

    Returns:
        - For SELECT queries: A list of tuples representing the fetched rows.
        - For non-SELECT queries: None.
        - None if an error occurs.
    """
    if not engine:
        print("Error: Invalid engine provided.")
        return None
        
    try:
        # Establish a connection from the engine pool.
        # The 'with' statement ensures the connection is returned to the pool.
        with engine.connect() as connection:
            # Prepare the query using text() for parameter binding safety.
            stmt = text(sql_query)
            # Execute the query with parameters.
            result = connection.execute(stmt, params or {})
            # Commit changes for INSERT/UPDATE/DELETE (implicitly handled by connect() context manager in future=True).
            # connection.commit() # Usually needed for non-future=True or explicit transaction blocks
            
            # Check if the query was expected to return rows (typically SELECT).
            if result.returns_rows:
                # Fetch all results if rows were returned.
                return result.fetchall()
            else:
                # Return None for statements like INSERT, UPDATE, DELETE.
                return None
    except SQLAlchemyError as e:
        # Handle errors during connection or query execution.
        print(f"Error executing SQL query: {e}")
        # Optionally rollback in case of error, although context manager handles this often.
        # connection.rollback()
        return None