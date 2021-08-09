# COMP3900 21T2
# Authored by COMP3900-T18A-Cooders

# Functions that involve user creation/interaction

import psycopg2
import psycopg2.extras
import re
from flask import jsonify
from flask_jwt_extended import (create_access_token)
from datetime import datetime


def get_profile(username, current_user, conn):
    # cursor factory returns results as a dict instead of list
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT user_id, first_name, last_name, email FROM public.users WHERE email = '{username}'"
    )
    result = cur.fetchone()
    cur.execute(
        f"SELECT user_id FROM public.users WHERE email = '{current_user}'"
    )
    current_user_id = cur.fetchone()
    cur.execute(
        f'''SELECT EXISTS(SELECT * from public.connections WHERE
        ({current_user_id['user_id']} = user_id_1 AND {result['user_id']} = user_id_2)
        OR ({current_user_id['user_id']} = user_id_2 AND {result['user_id']} = user_id_1))'''
    )
    exists = cur.fetchone()
    if exists['exists'] == False:
        return 'You are not connected to this user!', 403
    busy = busy_estimator(result['user_id'], conn)
    result['busy'] = busy
    cur.execute(
        f"SELECT public.tasks.* FROM public.task_assignments, public.tasks WHERE tasks.task_id = task_assignments.task_id AND task_assignments.user_id = {result['user_id']}"
    )
    result2 = cur.fetchall()
    result['tasks'] = result2
    conn.close()
    return jsonify(result), 200



def register(email, name_first, name_last, password, conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{email}'"
    )

    account = cur.fetchall()

    if account:
        # checks if account already exists
        return jsonify('Email has already been registered!'), 400

    elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        # checks if email is a valid email
        return jsonify('Invalid email!'), 400

    else:
        # New account and valid email address
        cur.execute(
            f"INSERT INTO public.users (email, first_name, last_name, password )VALUES ('{email}', '{name_first}', '{name_last}', '{password}')"
        )
        conn.commit()
        cur.close()
        conn.close()
        access_token = create_access_token(identity=email)
        return jsonify(username=email, access_token=access_token), 200



def busy_estimator(user_id, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
    	f"SELECT * FROM public.task_assignments WHERE user_id = {user_id}"
	)

    mean_num = 0
    mean_den = 0
    task_ids = cur.fetchall()
    #print(task_ids[0]['task_id'])
    #print(len(task_ids))
    if task_ids == ([]): return 0
    
    for i in range(0, len(task_ids)-1):
        cur.execute(
            f"SELECT * FROM public.tasks WHERE task_id = {task_ids[i]['task_id']}"
        )
        task = cur.fetchone()
        deadline = task['deadline']
        deadline = deadline.replace(tzinfo=None)
        priority = task['priority']
        time_remaining = deadline - datetime.now()

        time_remaining_in_s = time_remaining.total_seconds()
        hours = divmod(time_remaining_in_s, 3600)[0]
        mean_num += priority * hours
        mean_den += hours
        
    return round(mean_num/mean_den, 2)
