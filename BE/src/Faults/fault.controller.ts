import Fault from "./fault.model"

export async function getFaults(req, res, next) {
    const faults = await Fault.find();

    res.status(200).json(faults);
}

export async function getFaultById(req, res, next) {
    const fault = await Fault.findById(req.params.id);

    if (!fault) {
        return res.status(404, `Fault not found with id of ${req.params.id}`);
    }

    res.status(200).json(fault);
}

export async function addFault(req, res, next) {
    const fault = await Fault.create(req.body);

    res.status(201).json(fault);
}

export async function updateFault(req, res, next) {
    let fault = await Fault.findById(req.params.id);

    if (!fault) {
        return res.status(404, `Fault not found with id of ${req.params.id}`);
    }

    fault = await Fault.findOneAndUpdate(req.params.id, req.body, {
        new: true, // The response will be the updated data
        runValidators: true
    });

    res.status(200).json(fault);
}

export async function deleteFault(req, res, next) {
    let fault = await Fault.findById(req.params.id);

    if (!fault) {
        return res.status(404, `Fault not found with id of ${req.params.id}`);
    }

    fault.remove();

    res.status(200).json({});
}