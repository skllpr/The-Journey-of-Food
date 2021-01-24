import time
import random
import logging
from argparse import ArgumentParser, RawTextHelpFormatter

import psycopg2
from psycopg2.errors import SerializationFailure

def initialize_fruits(conn):
    with conn.cursor() as cur:
        cur.execute(
            "CREATE TABLE IF NOT EXISTS produce (id INT PRIMARY KEY, food STRING, origin STRING[], processing STRING[])"
        )
        cur.execute("UPSERT INTO produce (id, food, origin, processing) VALUES (12345, 'apple', ARRAY['Seattle, Washington'], ARRAY['Chicago, Illinois', 'Tampa, Florida']), (23456, 'banana', ARRAY['Honolulu, Hawaii'], ARRAY['San Fransisco, California', 'Austin, Texas'])")
        logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()
def print_all_fruits(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM produce")
        logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        print(f"All fruits at {time.asctime()}:")
        for row in rows:
            print(row)
def find_fruit(conn, id):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM produce WHERE id="+id)
        logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        print(f"Found fruit at {time.asctime()}:")
        for row in rows:
            print(row)
        return rows;
def insert_fruit(conn, id, fruit, origin1):
    with conn.cursor() as cur:
        cur.execute("INSERT INTO produce VALUES ("+id+","+fruit+",ARRAY['"+origin1+"'],ARRAY[])")
        cur.execute("SELECT * FROM produce WHERE id="+id)
        logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()


def insert_additional_origin(conn, id, origin2):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM produce WHERE id="+id)
        rows = cur.fetchall()
        rows[0][2].append(origin2)
        cur.execute("UPDATE produce SET origin =ARRAY" +str(rows[0][2]) + "WHERE id="+id)
        cur.execute("SELECT * FROM produce WHERE id="+id)
        rows = cur.fetchall()
        print(rows)

def insert_additional_processing(conn, id, processing2):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM produce WHERE id="+id)
        rows = cur.fetchall()
        rows[0][3].append(processing2)
        cur.execute("UPDATE produce SET processing =ARRAY" +str(rows[0][3]) + "WHERE id="+id)
        cur.execute("SELECT * FROM produce WHERE id="+id)
        rows = cur.fetchall()
        print(rows)

def main():
    opt = parse_cmdline()
    logging.basicConfig(level=logging.DEBUG if opt.verbose else logging.INFO)

    conn = psycopg2.connect(opt.dsn)
    initialize_fruits(conn)
    print_all_fruits(conn)
    find_fruit(conn, '12345')
    insert_additional_origin(conn, '12345', 'Wakanda')

def parse_cmdline():
    parser = ArgumentParser(description=__doc__,
                            formatter_class=RawTextHelpFormatter)
    parser.add_argument(
        "dsn")

    parser.add_argument("-v", "--verbose",
                        action="store_true", help="print debug info")

    opt = parser.parse_args()
    return opt


if __name__ == "__main__":
    main()
