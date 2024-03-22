from flask import jsonify

class Result:
    @staticmethod
    def error(code, message):
        result = {}
        result["code"] = str(code)
        result["message"] = str(message)
        return jsonify(result)

    @staticmethod
    def success(code, data):
        result = {}
        result["code"] = str(code)
        result["message"] = "success"
        if isinstance(data, bytes):
            result["data"] = str(data, 'utf-8')
        else:
            result["data"] = data
        return jsonify(result)