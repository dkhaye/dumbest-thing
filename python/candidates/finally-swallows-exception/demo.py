def get_value():
    try:
        raise ValueError("boom, something actually broke")
    finally:
        return 2


print(get_value())
