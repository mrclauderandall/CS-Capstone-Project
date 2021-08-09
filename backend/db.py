### COMP3900 21T2
### Authored by COMP3900-T18A-Cooders

## Functions to initialise and manage the database

import os
import psycopg2
from pathlib import Path

dbname = os.getenv('POSTGRES_DB')
dbuser = os.getenv('POSTGRES_USER')
dbpass = os.getenv('POSTGRES_PASSWORD')
dbhost = os.getenv('POSTGRES_HOST')

def get_conn():
    return psycopg2.connect(f"dbname={dbname} user={dbuser} password={dbpass} host={dbhost}")

def run_query(query_str):
    '''Runs query and returns cursor object which contains result'''
    conn = get_conn()
    # cursor factory returns results as a dict instead of list
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(query_str)
    result = cur.fetchall()
    cur.close()
    conn.close()
    return result

def init_db():
    try:
        # Get connection to db
        conn = get_conn()
        cur = conn.cursor()

        # Delete the tables if they exist
        cur.execute("DROP TABLE IF EXISTS task_status, tasks, users, connections, connection_requests, task_assignments;")

        # Create all the tables
        cur.execute("""
            CREATE TABLE public.task_status
            (
                status_id smallint NOT NULL,
                description character varying,
                PRIMARY KEY (status_id)
            );
        """)
        cur.execute("""
            CREATE TABLE public.tasks
            (
                task_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
                title character varying,
                description character varying,
                created timestamp with time zone DEFAULT now(),
                deadline timestamp with time zone,
                completed timestamp with time zone DEFAULT NULL,
                priority smallint,
                status_id smallint,
                parent_task_id integer,
                bumped boolean DEFAULT false,
                creator character varying DEFAULT'clinton0@epa.gov.au',
                PRIMARY KEY (task_id),
                CONSTRAINT status_id FOREIGN KEY (status_id)
                    REFERENCES public.task_status (status_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE SET NULL
            );
        """)
        cur.execute("""
            CREATE TABLE public.users
            (
                user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
                first_name character varying,
                last_name character varying,
                email character varying,
                password character varying,
                profile_pic character varying DEFAULT NULL,
                PRIMARY KEY (user_id)
            );
        """)
        cur.execute("""
            CREATE TABLE public.connections
            (
                user_id_1 integer NOT NULL,
                user_id_2 integer NOT NULL,
                CONSTRAINT connections_unique UNIQUE (user_id_1, user_id_2),
                CONSTRAINT user_id_1_fkey FOREIGN KEY (user_id_1)
                    REFERENCES public.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE,
                CONSTRAINT user_id_2_fkey FOREIGN KEY (user_id_2)
                    REFERENCES public.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE
            );
        """)
        cur.execute("""
            CREATE TABLE public.connection_requests
            (
                sender_id integer NOT NULL,
                receiver_id integer NOT NULL,
                requested timestamp with time zone DEFAULT now(),
                accepted boolean DEFAULT false,
                CONSTRAINT sender_id_fkey FOREIGN KEY (sender_id)
                    REFERENCES public.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE,
                CONSTRAINT receiver_id_fkey FOREIGN KEY (receiver_id)
                    REFERENCES public.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE
            );
        """)
        cur.execute("""
            CREATE TABLE public.task_assignments
            (
                task_id integer NOT NULL,
                user_id integer NOT NULL,
                PRIMARY KEY (task_id, user_id),
                CONSTRAINT task_id_fkey FOREIGN KEY (task_id)
                    REFERENCES public.tasks (task_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE
                    NOT VALID,
                CONSTRAINT user_id_fkey FOREIGN KEY (user_id)
                    REFERENCES public.users (user_id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE CASCADE
                    NOT VALID
            );
        """)

        # Copy in test data
        base_path = Path(__file__).parent
        
        file_path = (base_path / "testdata/users.csv").resolve()
        f = open(file_path, 'r')
        cur.copy_from(f, 'users', sep=',', columns=('first_name', 'last_name', 'email', 'password'))
        f.close()
        file_path = (base_path / "testdata/task_status.csv").resolve()
        f = open(file_path, 'r')
        cur.copy_from(f, 'task_status', sep=',', columns=('status_id', 'description'))
        f.close()
        file_path = (base_path / "testdata/tasks.csv").resolve()
        f = open(file_path, 'r')
        cur.copy_from(f, 'tasks', sep=',', columns=('title', 'description', 'created', 'deadline', 'priority', 'status_id'))
        f.close()
        file_path = (base_path / "testdata/task_assignments.csv").resolve()
        f = open(file_path, 'r')
        cur.copy_from(f, 'task_assignments', sep=',', columns=('task_id', 'user_id'))
        f.close()

        # Commit changes
        conn.commit()
        # Close connection
        cur.close()
        conn.close()
        print("database operation completed successfully")
        return "success"
    except:
        print("I am unable to connect to the database.")
        return "error"