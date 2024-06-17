from locust import HttpUser, TaskSet, task, between
import jwt

headers = { # JWT 头部
    "alg": "HS256",
    "typ": "JWT"
}
payload = { # JWT 载荷
    "user_id": 'liuhanyan12',
    "user_permission": 0
}
token = jwt.encode(payload=payload, key="rec", algorithm='HS256', headers=headers) # 生成 token

class UserBehavior(TaskSet):
    def on_start(self):
        self.client.post("personal_center/login", json={'username': '0buryh4omz', 'password': '1234'})

    @task
    def data_visualization(self):
        # self.client.get("data_visualization/get_chart_data1?pid=1")
        self.client.get("data_visualization/get_chart_data2")

    @task
    def customer_management(self):
        self.client.get("customer_management/query_all_customers")

    @task
    def follow_up_management(self):
        self.client.post("follow_up_management/query_all_records", headers={ "Authorization": token })

    @task
    def user_management(self):
        self.client.post("user_management/query_all_users", headers={ "Authorization": token })

    @task
    def personal_center(self):
        self.client.post("personal_center/query_personal_info", headers={ "Authorization": token })
    

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(5, 9)
