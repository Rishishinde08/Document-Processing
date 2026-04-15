import json
import csv
from io import StringIO

# JSON Export
def export_to_json(document):
    if not document.result:
        return None
    
    try:
        data = json.loads(document.result)
    except:
        data = {"raw": document.result}

    return json.dumps(data, indent=4)


# CSV Export
def export_to_csv(document):
    if not document.result:
        return None

    try:
        data = json.loads(document.result)
    except:
        data = {"raw": document.result}

    output = StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow(["key", "value"])

    # Data
    for key, value in data.items():
        writer.writerow([key, value])

    return output.getvalue()