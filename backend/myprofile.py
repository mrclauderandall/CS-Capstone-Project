import psycopg2
from flask import jsonify

#
# Should we migrate these functions to user.py?
#

def myprofile(username, conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT * FROM public.users WHERE email = '{username}'"
    )
    result = cur.fetchall()
    conn.close()
    return(jsonify(result))

def editprofile(email, first_name, last_name, password, username, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE public.users SET first_name = '{first_name}', last_name = '{last_name}', password = '{password}', email = '{email}' WHERE email = '{username}'"
    )
    conn.commit()
    conn.close()
    return(jsonify(200))

def setDP(image_url, username, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE public.users SET profile_pic = '{image_url}' WHERE email = '{username}'"
    )
    conn.commit()
    conn.close()
    return(jsonify(200))

def getDP(username, conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT profile_pic FROM public.users WHERE email = '{username}'"
    )
    result = cur.fetchone()
    conn.commit()
    conn.close()
    return (jsonify(result[0]))

def removeDP(username, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE public.users SET profile_pic = NULL WHERE email = '{username}'"
    )
    conn.commit()
    conn.close()
    return(jsonify(200))