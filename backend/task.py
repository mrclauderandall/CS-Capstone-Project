### COMP3900 21T2
### Authored by COMP3900-T18A-Cooders

## Functions for interacting with task tables

import psycopg2
from flask import jsonify

def create(user, title, desc, deadline, prio, status, parent_id, username, conn):
    cur = conn.cursor()
    
    # find user in database
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{username}'"
    )
    user_details = cur.fetchone()
    user_id = user_details[0]

    # insert task into db
    cur.execute(
        f'''
        INSERT INTO public.tasks (title, description, deadline, priority, status_id, parent_task_id, creator)
        VALUES ('{title}', '{desc}', '{deadline}', {prio}, {status}, {parent_id}, '{user}')
        '''
    )

    # tidying
    conn.commit()
    cur.execute(
        f"SELECT * FROM public.tasks WHERE title = '{title}' AND description = '{desc}'"
    )
    task_details = cur.fetchone()
    task_id = task_details[0]
    cur.execute(
        f'''
        INSERT INTO public.task_assignments (task_id, user_id)
        VALUES ({task_id}, {user_id})
        '''
    )
    conn.commit() 
    cur.close()
    conn.close()
    return jsonify(task_details)

def edit(task_id, title, desc, deadline, prio, parent_id, username, conn):
    cur = conn.cursor()
    cur.execute(
        f'''UPDATE public.tasks
        SET title = '{title}',
        description = '{desc}',
        deadline = '{deadline}',
        priority = {prio},
        parent_task_id = {parent_id}
        WHERE task_id = {task_id}'''
    )
    conn.commit()
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{username}'"
    )
    user_details = cur.fetchone()
    user_id = user_details[0]
    cur.execute(
        f"UPDATE public.task_assignments SET user_id = {user_id} WHERE task_id = {task_id}"
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify("Task updated successfully")

def bump(task_id, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM public.tasks WHERE task_id = {task_id}"
    )
    task_details = cur.fetchone()
    task_bumped = task_details['bumped']
    print(task_bumped)
    if task_bumped == 0:
       cur.execute(
            f"UPDATE public.tasks SET bumped = True WHERE task_id = {task_id}"
       )
       conn.commit()
       cur.close()
       conn.close()
       return jsonify(True), 200
    else:
        cur.execute(
            f"UPDATE public.tasks SET bumped = False WHERE task_id = {task_id}"
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify(False), 200

def delete_task(task_id, conn):
    print(task_id)
    cur = conn.cursor()
    cur.execute(f"DELETE FROM public.tasks WHERE task_id = {task_id}")
    cur.execute(f"DELETE FROM public.task_assignments WHERE task_id = {task_id}")
    conn.commit()
    cur.close()
    conn.close()
    return jsonify('{task_id} deleted'), 200
