from rest_framework.decorators import api_view
from rest_framework.response import Response
import pymysql


def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="root",
        database="webdb11",
        cursorclass=pymysql.cursors.DictCursor
    )

def ensure_single_admin():
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT id FROM users1 WHERE role='admin'")
        admin = cur.fetchone()

        if not admin:
            cur.execute("""
                INSERT INTO users1
                (username,email,password,mobile,address,role,approved)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (
                "admin",
                "admin@gmail.com",
                "admin",
                "1234567890",
                "Hyderabad",
                "admin",
                1
            ))
            con.commit()


@api_view(["POST"])
def register_api(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm = request.data.get("confirm_password")
    mobile = request.data.get("mobile")
    address = request.data.get("address")

    if password != confirm:
        return Response({"error": "Passwords do not match"})

    if not all([username, email, password, mobile, address]):
        return Response({"error": "All fields are required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()

        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        if cur.fetchone():
            return Response({"error": "Username already exists"})

        cur.execute("SELECT id FROM users1 WHERE email=%s", (email,))
        if cur.fetchone():
            return Response({"error": "Email already exists"})

        cur.execute("SELECT id FROM users1 WHERE mobile=%s", (mobile,))
        if cur.fetchone():
            return Response({"error": "Mobile already exists"})

        cur.execute("""
            INSERT INTO users1
            (username,email,password,mobile,address,role,approved)
            VALUES (%s,%s,%s,%s,%s,'user',0)
        """, (username, email, password, mobile, address))
        con.commit()

    return Response({"success": "Account created. Awaiting Admin approval"})


@api_view(["POST"])
def login_api(request):
    ensure_single_admin()
    username = request.data.get("username")
    password = request.data.get("password")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT * FROM users1
            WHERE username=%s AND password=%s
        """, (username, password))
        user = cur.fetchone()

    if not user:
        return Response({"error": "Invalid username or password"})

    if user["approved"] == 0:
        return Response({"error": "Account not approved by admin"})

    return Response({
        "success": "Login successful",
        "username": user["username"],
        "role": user["role"]
    })


@api_view(["GET"])
def admin_users_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT id, username, email, mobile, approved
            FROM users1
            WHERE role='user'
        """)
        users = cur.fetchall()

    return Response({"users": users})


@api_view(["POST"])
def approve_user_api(request):
    username = request.data.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            UPDATE users1 SET approved=1
            WHERE username=%s
        """, (username,))
        con.commit()

    return Response({"success": "User approved"})


@api_view(["GET"])
def user_details_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM users1 WHERE username=%s", (username,))
        user = cur.fetchone()

    return Response({"user": user})


@api_view(["POST"])
def add_truck_api(request):
    username = request.data.get("username")
    market_date = request.data.get("market_date")
    truck_number = request.data.get("truck_number") or None
    route_from = request.data.get("route_from")
    route_to = request.data.get("route_to")
    available_space = request.data.get("available_space")

    if not all([username, market_date, route_from, route_to, available_space]):
        return Response({"error": "All fields are required"}, status=400)

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        user = cur.fetchone()

        if not user:
            return Response({"error": "User not found"}, status=400)

        cur.execute("""
            INSERT INTO truck_posts
            (user_id, market_date, truck_number, route_from, route_to, available_space)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (
            user["id"],
            market_date,
            truck_number,
            route_from,
            route_to,
            float(available_space)
        ))
        con.commit()

    return Response({"success": "Truck added successfully"})


@api_view(["GET"])
def view_trucks_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT tp.id, tp.market_date, tp.route_from,
                   tp.route_to, tp.available_space, u.username
            FROM truck_posts tp
            JOIN users1 u ON tp.user_id = u.id
            WHERE u.username != %s
        """, (username,))
        trucks = cur.fetchall()

    return Response({"items": trucks})


@api_view(["GET"])
def my_trucks_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT tp.id, tp.market_date, tp.route_from,
                   tp.route_to, tp.available_space
            FROM truck_posts tp
            JOIN users1 u ON tp.user_id = u.id
            WHERE u.username=%s
        """, (username,))
        trucks = cur.fetchall()

    return Response({"items": trucks})


@api_view(["POST"])
def request_truck_api(request):
    username = request.data.get("username")
    truck_id = request.data.get("truck_id")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        user = cur.fetchone()

        if not user:
            return Response({"error": "User not found"}, status=400)

        cur.execute("SELECT id FROM truck_posts WHERE id=%s", (truck_id,))
        if not cur.fetchone():
            return Response({"error": "Truck not found"}, status=400)

        cur.execute("""
            INSERT INTO transport_requests (post_id, requester_id)
            VALUES (%s,%s)
        """, (truck_id, user["id"]))
        con.commit()

    return Response({"success": "Request sent"})


@api_view(["GET"])
def truck_requests_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT
                tr.id AS request_id,
                u.username AS requester,
                tr.status
            FROM transport_requests tr
            JOIN truck_posts tp ON tr.post_id = tp.id
            JOIN users1 owner ON tp.user_id = owner.id
            JOIN users1 u ON tr.requester_id = u.id
            WHERE owner.username=%s
        """, (username,))
        requests = cur.fetchall()

    return Response({"requests": requests})


@api_view(["POST"])
def update_truck_request_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            UPDATE transport_requests
            SET status=%s
            WHERE id=%s
        """, (
            request.data.get("status"),
            request.data.get("request_id")
        ))
        con.commit()

    return Response({"success": "Updated"})


@api_view(["GET"])
def my_transport_requests_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT
                tr.id AS request_id,
                tp.market_date,
                owner.username AS owner,
                tr.status,
                owner.mobile AS owner_mobile,
                owner.address AS owner_address,
                tp.id AS truck_id
            FROM transport_requests tr
            JOIN truck_posts tp ON tr.post_id = tp.id
            JOIN users1 owner ON tp.user_id = owner.id
            JOIN users1 u ON tr.requester_id = u.id
            WHERE u.username=%s
        """, (username,))
        items = cur.fetchall()

    return Response({"items": items})
    
@api_view(["GET"])
def admin_all_requests_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT
                u.username AS requester,
                owner.username AS owner,
                tp.route_from,
                tp.route_to,
                tp.market_date,
                tr.status
            FROM transport_requests tr
            JOIN users1 u ON tr.requester_id = u.id
            JOIN truck_posts tp ON tr.post_id = tp.id
            JOIN users1 owner ON tp.user_id = owner.id
        """)
        data = cur.fetchall()

    return Response({"requests": data})
