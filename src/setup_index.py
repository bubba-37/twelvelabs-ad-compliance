"""Step 1: create the Marengo search index. Paste the printed ID into .env."""
from tl_client import INDEX_MODEL, client

index = client.indexes.create(
    index_name="lumiere-campaign-ads",
    models=[{"model_name": INDEX_MODEL, "model_options": ["visual", "audio"]}],
)
print(f"INDEX_ID={index.id}")
print("Add that line to .env")
