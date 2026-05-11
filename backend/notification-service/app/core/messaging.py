import json
import threading
import time
import pika
from .config import get_settings

settings = get_settings()

class NotificationConsumer:
    def __init__(self):
        self.connection = None
        self.channel = None
        self._running = False
        self._thread = None

    def connect(self):
        params = pika.URLParameters(settings.RABBITMQ_URL)
        max_retries = 10
        for i in range(max_retries):
            try:
                self.connection = pika.BlockingConnection(params)
                self.channel = self.connection.channel()
                self.channel.exchange_declare(exchange="orders", exchange_type="topic", durable=True)

                # Create queues
                self.channel.queue_declare(queue="order_notifications", durable=True)
                self.channel.queue_bind(exchange="orders", queue="order_notifications", routing_key="order.*")
                print("[Notification] Successfully connected to RabbitMQ")
                return True
            except pika.exceptions.AMQPConnectionError:
                if i < max_retries - 1:
                    print(f"[Notification] RabbitMQ connection failed, retrying in 5 seconds... ({i+1}/{max_retries})")
                    time.sleep(5)
                else:
                    print("[Notification] Failed to connect to RabbitMQ after max retries")
                    return False

    def process_message(self, ch, method, properties, body):
        message = json.loads(body)
        print(f"[Notification] Received: {method.routing_key} - {message}")

        if method.routing_key == "order.created":
            self.send_order_confirmation(message)
        elif method.routing_key == "order.updated":
            self.send_status_update(message)

        ch.basic_ack(delivery_tag=method.delivery_tag)

    def send_order_confirmation(self, message):
        order_id = message.get("orderId")
        user_id = message.get("userId")
        total = message.get("total")
        print(f"[Email] Order confirmation sent to user {user_id} for order {order_id} (${total})")

    def send_status_update(self, message):
        order_id = message.get("orderId")
        status = message.get("status")
        print(f"[Email] Status update: Order {order_id} is now {status}")

    def start_consuming(self):
        if not self.connect():
            return
        self._running = True
        self.channel.basic_consume(queue="order_notifications", on_message_callback=self.process_message)
        print("[Notification] Started consuming messages...")
        try:
            self.channel.start_consuming()
        except Exception as e:
            print(f"[Notification] Consumer stopped with error: {e}")
        finally:
            self._running = False

    def start(self):
        if self._running:
            print("[Notification] Consumer is already running")
            return
        self._thread = threading.Thread(target=self.start_consuming, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self.connection and self.connection.is_open:
            self.connection.close()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)

consumer = NotificationConsumer()
