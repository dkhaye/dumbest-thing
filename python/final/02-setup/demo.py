def reraise():
    try:
        raise ValueError("boom")
    except Exception as e:
        raise

reraise()
