import json
import pika
from .config import get_settings

settings = get_settings()

class MessagePublisher:
    def __init__(self):
        self.connection = None
        self.channel = None

    def connect(self):
        if not self.connection or self.connection.is_closed:
            params = pika.URLParameters(settings.RABBITMQ_URL)
            self.connection = pika.BlockingConnection(params)
            self.channel = self.connection.channel()
            self.channel.exchange_declare(exchange="orders", exchange_type="topic", durable=True)

    def publish(self, routing_key: str, message: dict):
        self.connect()
        self.channel.basic_publish(
            exchange="orders",
            routing_key=routing_key,
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2),
        )

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()

publisher = MessagePublisher()
