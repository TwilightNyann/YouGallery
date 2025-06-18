import boto3
import os
from botocore.client import Config

def init_minio():
    print("Initializing MinIO...")
    
    # Get environment variables
    endpoint_url = os.getenv('S3_ENDPOINT_URL', 'http://minio:9000')
    access_key = os.getenv('AWS_ACCESS_KEY_ID', 'minioadmin')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY', 'minioadmin123')
    bucket_name = os.getenv('S3_BUCKET_NAME', 'yougallery')
    
    # Create S3 client
    s3_client = boto3.client(
        's3',
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(signature_version='s3v4'),
        region_name='us-east-1'
    )
    
    # Check if bucket exists
    try:
        s3_client.head_bucket(Bucket=bucket_name)
        print(f"Bucket '{bucket_name}' already exists")
    except:
        # Create bucket
        try:
            s3_client.create_bucket(Bucket=bucket_name)
            print(f"Bucket '{bucket_name}' created successfully")
            
            # Set bucket policy to allow public read
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": "*"},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
                    }
                ]
            }
            s3_client.put_bucket_policy(Bucket=bucket_name, Policy=str(policy).replace("'", '"'))
            print(f"Public read policy set for bucket '{bucket_name}'")
        except Exception as e:
            print(f"Error creating bucket: {e}")

if __name__ == "__main__":
    init_minio()
