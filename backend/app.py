# COMP3900 21T2
# Authored by COMP3900-T18A-Cooders

# Server layer



from datetime import datetime, timedelta
#from pytz import timezone
from flask import Flask, redirect, request, url_for, session, jsonify, make_response
from flask_cors import CORS, cross_origin
import db
import task as Task
import user as User
import myprofile as myProfile
import connections as Connections
from flask_jwt_extended import (JWTManager, jwt_required, 
                                get_jwt_identity, create_access_token)
from hashlib import md5
#tz = timezone('AEST')
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'cooders'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
#app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True
jwt = JWTManager(app)
CORS(app, supports_credentials=True)
#app.secret_key = 'cooders'


# index
@app.route('/')
@jwt_required()
def index():
    #if 'username' in session:
    #    username = session['username']
        username = get_jwt_identity()
        conn = db.get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT * FROM public.users WHERE email = '{username}'"
        )
        result = cur.fetchone()
        cur.execute(
            f"SELECT public.tasks.* FROM public.task_assignments, public.tasks WHERE tasks.task_id = task_assignments.task_id AND task_assignments.user_id = {result[0]}"
        )
        result2 = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(result2)
        # return 'Logged in as ' + username + 'user id: ' + str(result[0]) + '<br>' + "<b><a href = '/logout'>click here to log out</a></b>"

    #return redirect(url_for('login'))

@app.route('/created_tasks')
@jwt_required()
def created_tasks():
    #if 'username' in session:
    #    username = session['username']
        username = get_jwt_identity()
        conn = db.get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT * FROM public.tasks WHERE tasks.creator = '{username}'"
        )
        result2 = cur.fetchall()
        cur.close()
        conn.close()
        print("hi")
        print(result2)
        return jsonify(result2)
        # return 'Logged in as ' + username + 'user id: ' + str(result[0]) + '<br>' + "<b><a href = '/logout'>click here to log out</a></b>"

    #return redirect(url_for('login'))


@app.route('/getsession')
@jwt_required()
def get_session():
    username = get_jwt_identity()
    try:
        user = db.run_query(f"select user_id, first_name, last_name, email from users where email = '{username}'")
        return jsonify(user=user[0]), 200
    except:
        print('error retrieving user')
        return jsonify('ERROR AUTHENTICATING USER'), 404

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return '''	
        <form action="" method="post">
            <input type="text" placeholder="Username" name="username">
            <input type="password" placeholder="Password" name="password">
            <input class="btn btn-default" type="submit" value="Login">
        </form>	
        '''
  #  try:
    else:
        username = request.json['username']
        print(request.json['password'])
        password = md5()
        password.update(request.json['password'].encode('utf-8'))
        password = password.hexdigest()
        print(password)
        access_token = create_access_token(identity=username)
        ####WRITE ASSERT THAT THEY ARE IN DATABASE
        try:
            user = db.run_query(f"select user_id, first_name, last_name, email, password from users where email = '{username}'")
            if (user[0]['password'] != password):
                return jsonify('WRONG PASSWORD'), 403
            return jsonify(user=user[0], access_token=access_token), 200
        except:
            print('error retrieving user')
            return jsonify('ERROR AUTHENTICATING USER'), 404
  #  except:
  #      session['username'] = request.form['username']
  #      return redirect(url_for('index'))


# remove the username from the session if it is there
'''
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
'''


# creates a new user based on info provided
@app.route('/register', methods=['GET', 'POST'])
def create_user():
    # try except here?
    if request.method == 'POST' and request.json['username'] and request.json['name_first'] and request.json['name_last']:
        email = request.json['username']
        name_first = request.json['name_first']
        name_last = request.json['name_last']
        password = md5()
        password.update(request.json['password'].encode('utf-8'))
        password = password.hexdigest()
        print(password)
        return User.register(email, name_first, name_last, password, db.get_conn())
    elif request.method == 'POST':
        # means that the form is not filled properly
        return jsonify('Please fill out the form completely!'), 400

    return


@app.route('/newtask', methods=['POST'])
@jwt_required()
def create_task():
    if request.method == 'POST':
        # with request.form as req:
        try:
            req = request.json
            user = get_jwt_identity()
            title = req['title']
            desc = req['description']
            deadline = datetime.strptime(req['deadline'], "%a, %d %b %Y %H:%M:%S %Z")
            prio = req['priority']
            status = req['status_id']
            parent_id = req['parent_task_id']
            username = req['user']
            if username == "":
                username = user
            return Task.create(user, title, desc, deadline, prio, status, parent_id, username, db.get_conn()), 200
        except:  # incomplete form
            return jsonify('Please fill out the form completely!'), 400
        '''
            username = session['username']
            return f
                <form action="" method="post">
                    <input type="text" placeholder="Title" name="title">
                    <input type="text" placeholder="Description" name="description">
                    <input type="datetime-local" id="deadline" name="deadline" value="YYYY-MM-DDT00:00">
                    <input type="number" step="1" placeholder="priority" name = "priority"> 
                    <input type="number" step="1" placeholder="status_id" name = "status_id">
                    <input type="number" step="1" placeholder="parent_task_id" name = "parent_task_id">
                    <input type="text" placeholder="User to allocate.." name="user" value={username}>
                    <input class="btn btn-default" type="submit" value="Submit">
                </form>
                '''


# edit an existing task
@app.route('/edit_task', methods=['GET', 'POST'])
@jwt_required()
def edit_task():
    if request.method == 'POST':
        task_id = request.args.get('task_id')
        req = request.json
        #user = session['username']
        title = req['title']
        desc = req['description']
        deadline = datetime.strptime(req['deadline'], "%a, %d %b %Y %H:%M:%S %Z")
        prio = req['priority']
        parent_id = req['parent_task_id']
        username = req['user']
        # if username == "":
        #    username = user
        return Task.edit(task_id, title, desc, deadline, prio,
                  parent_id, username, db.get_conn()), 200
    else:
        task_id = request.args.get('task_id')
        conn = db.get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT * FROM public.tasks WHERE tasks.task_id = '{task_id}'"
        )
        result2 = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(result2)

@app.route('/delete_task')
def delete_task():
    task_id = request.args.get('task_id')
    print(task_id)
    return Task.delete_task(task_id, db.get_conn())





@app.route('/taskstatus', methods=['PUT'])
def edit_task_status():
    
    request_data = request.get_json()
    print(request_data)
    task_id = request_data['task_id']
    task_status = request_data['task_status']
    try: 
        conn = db.get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE public.tasks SET status_id = {task_status} WHERE task_id = {task_id}"
        )
        cur.close()
        conn.commit()
        conn.close()
        return jsonify(id = task_id, status=task_status), 200
    except:
        return jsonify('Error updating task status'), 500


@app.route('/bump_task', methods=['GET', 'POST'])
def bump_task():
    if request.method == 'POST':
        task_id = request.json['task_id']
        conn = db.get_conn()
        return Task.bump(task_id, conn)
    return '''	
    <form action="" method="post">
        <input type="text" placeholder="id" name="task_id">
        <input class="btn btn-default" type="submit" value="Login">
    </form>	
    '''

# initialize a database
@app.route('/initdb')
def initdb():
    return db.init_db()


@app.route('/user', methods=['GET'])
@jwt_required()
def user_profile():
    # get user_id
    username = request.args.get('username')

    try:       
        return User.get_profile(username, get_jwt_identity(), db.get_conn())
    except Exception as e:
        print(e)
        return 'Profile not found', 404


@app.route('/myprofile')
def myprofile():
    return myProfile.myprofile(session['username'], db.get_conn())


@app.route('/myprofile/edit', methods=['GET', 'POST'])
def profile_edit():
    if request.method == 'POST' and request.json['password'] and request.json['first_name'] and request.json['last_name'] and request.json['email']:
        username = request.json['username']
        email = request.json['email']
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        password = md5()
        password.update(request.json['password'].encode('utf-8'))
        password = password.hexdigest()
        access_token = create_access_token(identity=email)
        myProfile.editprofile(email, first_name, last_name, password, username, db.get_conn())
        user = db.run_query(f"select user_id, first_name, last_name, email, password from users where email = '{email}'")
        return jsonify(user=user[0], access_token=access_token), 200

    elif request.method == 'POST':
        # means that the form is not filled properly
        return jsonify('Please fill out the form completely!'), 400

    return '''	
    <form action="" method="post">
        <input type="Change First Name" placeholder="Name..." name="first_name">
        <input type="Change Last Name" placeholder="Name..." name="last_name">        
        <input type="Change Password" placeholder="Name..." name="password">
        <input type="Change Email" placeholder="Name..." name="email">
        <input type="Change Username" placeholder="Name..." name="username">
        <input class="btn btn-default" type="submit" value="Submit">
    </form>	
    '''
@app.route('/myprofile/setDP', methods=['GET', 'POST'])
def setDP():
    if request.method == 'POST':
        username = request.json['username']
        image_url = request.json['image_url']
        return myProfile.setDP(image_url, username, db.get_conn())
    return '''	
    <form action="" method="post">
        <input type="Change url" placeholder="Url..." name="image_url">
        <input type="Change Username" placeholder="Name..." name="username">
        <input class="btn btn-default" type="submit" value="Submit">
    </form>	
    '''


@app.route('/myprofile/getDP', methods=['GET'])
def getDP():
    if request.method == 'GET':
        username = request.args['username']
        return myProfile.getDP(username, db.get_conn())
    return '''	
    <form action="" method="get">
        <input type="Change Username" placeholder="Name..." name="username">
        <input class="btn btn-default" type="submit" value="Submit">
    </form>	
    '''


@app.route('/connections', methods = ['GET'])
@jwt_required()
def connections():
    try:
        return jsonify(Connections.get_connections(get_jwt_identity(), db.get_conn())), 200
    except:
        return jsonify('Error getting connections'), 500

@app.route('/connections_for_task', methods = ['GET'])
@jwt_required()
def connections_for_task():
    try:
        return Connections.get_connections_for_task(get_jwt_identity(), db.get_conn()), 200
    except:
        return jsonify('Error getting connections'), 500


@app.route('/connections/requests', methods = ['GET'])
@jwt_required()
def connections_request():
    try:
        return jsonify(Connections.get_connection_requests(get_jwt_identity(), db.get_conn())), 200
    except:
        return jsonify('Error getting connection requests'), 500


@app.route('/connections/requests/create', methods = ['GET', 'POST'])
@jwt_required()
def connections_create_request():
    if request.method == 'POST':
        Connections.create_connection_request(get_jwt_identity(), request.json['receiver_username'], db.get_conn()) 
        #return redirect(url_for('connections'))
        response = jsonify([200])
        return response 
    else:
        return 'invalid request'


@app.route('/connections/accept')
@jwt_required()
def connections_accept():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')
    Connections.connection_accept(sender_id, receiver_id, db.get_conn())
    response = jsonify([200])
    return response


@app.route('/connections/reject')
@jwt_required()
def connections_reject():
    sender_id = request.args.get('sender_id')
    reciever_id = request.args.get('receiver_id')
    Connections.connection_reject(sender_id, reciever_id, db.get_conn())
    response = jsonify([200])
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0')
