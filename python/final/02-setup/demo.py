def loud():
    try:
        raise ValueError("boom")
    except Exception as e:
        raise

loud()
