# Import the driver.
import psycopg2

# Connect to the database.
conn = psycopg2.connect(
    user='sohil',
    password='password1234',
    host='jolly-vole-8j2.gcp-us-east1.cockroachlabs.cloud',
    port=26257,
    database='defaultdb',
    sslmode='verify-full',
    sslrootcert='./jolly-vole-ca.crt'
)
