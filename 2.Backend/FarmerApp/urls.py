from django.urls import path
from .views import *

urlpatterns = [

    # AUTH
    path("register/", register_api),
    path("login/", login_api),

    # USER
    path("userdetails/", user_details_api),
    path("add-truck/", add_truck_api),
    path("trucks/", view_trucks_api),
    path("my-trucks/", my_trucks_api),
    path("request-truck/", request_truck_api),
    path("truck-requests/", truck_requests_api),
    path("update-truck-request/", update_truck_request_api),
    path("my-transport-requests/", my_transport_requests_api),

    # ADMIN
    path("admin/", admin_users_api),
    path("approve/", approve_user_api),
    path("admin/all-requests/", admin_all_requests_api),

]
