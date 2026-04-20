import ApirError from "../utils/ApiError.js";

const validate = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const message = result.error.issues[0].message;
            return next(new ApirError(400, message));
        }

        req.body = result.data;
        next();
    }
};

export default validate;