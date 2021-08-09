import psycopg2.extras
from flask import jsonify

def get_connections(username, conn):
    # cursor factory returns results as a dict instead of list
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT user_id FROM public.users WHERE email = '{username}'"
    )
    user_details = cur.fetchone()
    cur.execute(
        f"""SELECT distinct public.users.*
        FROM public.connections,public.users 
        WHERE (public.connections.user_id_1 = {user_details['user_id']} AND public.connections.user_id_2 = public.users.user_id) 
        OR (public.connections.user_id_2 = {user_details['user_id']} AND public.connections.user_id_1 = public.users.user_id)"""
    )
    connections = cur.fetchall()
    cur.close()
    conn.close()
    return connections

def get_connection_requests(username, conn):
    # cursor factory returns results as a dict instead of list
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{username}'"
    )
    user_details = cur.fetchone()
    cur.execute(
        f"""SELECT 
            reqs.sender_id,
            reqs.receiver_id,
            reqs.requested,
            reqs.accepted,
            users.first_name,
            users.last_name,
            users.email,
            users.profile_pic
        FROM 
        public.connection_requests reqs
        left join public.users users
        on reqs.sender_id = users.user_id
        WHERE receiver_id = {user_details['user_id']}"""
    )
    requests = cur.fetchall()
    cur.close()
    conn.close()
    return requests

def get_connections_for_task(username, conn):
    # cursor factory returns results as a dict instead of list
    cur = conn.cursor()
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{username}'"
    )
    user_details = cur.fetchone()
    user_id = user_details[0]
    cur.execute(
        f"""SELECT public.users.email FROM public.connections,public.users 
        WHERE (public.connections.user_id_1 = {user_id} AND public.connections.user_id_2 = public.users.user_id) 
        OR (public.connections.user_id_2 = {user_id} AND public.connections.user_id_1 = public.users.user_id)"""
    )
    results_r = cur.fetchall()
    results_r.append([username])
    #results_r.append(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(results_r)

def create_connection_request(username, receiver_username, conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{username}'"
    )
    user_details = cur.fetchone()
    user_id = user_details[0]
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{receiver_username}'"
    )
    receiver_details = cur.fetchone()
    receiver_id = receiver_details[0]
    cur.execute(
        f'''
        INSERT INTO public.connection_requests (sender_id, receiver_id)
        VALUES ({user_id}, {receiver_id})'''
    )
    conn.commit()
    cur.close()
    conn.close()

def connection_accept(sender_id, receiver_id, conn):
    cur = conn.cursor()
    cur.execute(
        f'''
        DELETE FROM public.connection_requests WHERE sender_id = {sender_id} AND receiver_id = {receiver_id}
        '''
    )
    conn.commit()
    cur.execute(
        f'''
        INSERT INTO public.connections (user_id_1, user_id_2)
        VALUES ({sender_id}, {receiver_id})'''
    )
    conn.commit()
    cur.close()
    conn.close()

def connection_reject(sender_id, receiver_id, conn):
    cur = conn.cursor()
    cur.execute(
        f'''
        DELETE FROM public.connection_requests WHERE sender_id = {sender_id} AND receiver_id = {receiver_id}
        '''
    )
    conn.commit()
    cur.close()
    conn.close()