# .mmry File Format (Custom Data Storage)
# Chronological, Multi-data Storage
# Optimized for Fast Retrieval
# Contains Video, Audio, Metadata, AI Insights

import json
import datetime

def create_mmry_file(user_id, event_data):
    mmry_data = {
        "user_id": user_id,
        "timestamp": datetime.datetime.now().isoformat(),
        "event_data": event_data
    }
    filename = f"mmry_storage/{user_id}_{datetime.datetime.now().isoformat()}.mmry"
    with open(filename, "w") as f:
        json.dump(mmry_data, f)
