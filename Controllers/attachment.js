const attachmentModel = require('../Models/Attachment');

const getAttachmentsHandler = (req, res, next) => {

    attachmentModel.find({}).sort({createdAt: -1})
    .then(attachments => {
        res.status(201).json({success: true, data: attachments});
    })
    .catch(err => { next(err) });
};

const uploadFilesHandler = async (req) => {

    if(req.files){
        const attachments = [];
        req.files.forEach(item => {
            const temp = {
                title: item.originalname,
                path: item.path,
                type: item.mimetype,
                size: item.size,
                uploadedBy: req.user
            };
            attachments.push(temp);
        });
        if(attachments.length !== 0) {
            return await attachmentModel.insertMany(attachments);
        }
    }else{
        return null;
    }
};

const addAttachmentsHandler = (req, res, next) => {
    uploadFilesHandler(req).then(result => {
        if(result){
            res.status(200).json({success: true, data: result});
        }else{
            throw new Error('Nothing found to upload!')
        }
    }).catch(err => next(err));
};

const deleteAttachmentHandler = (req, res, next) => {
    attachmentModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({
            success: true,
            data: [
                {
                    msg: `Attachment with ID: ${req.params.id} has been deleted successfully!`
                }
            ]
        });
    })
    .catch(err => {next(err)});
};

const getAttachmentHandler = (req, res, next) => {
    const attachmentId = req.params.id;
    attachmentModel.find({_id: attachmentId, uploadedBy: req.user})
    .then(attachment => {
        res.status(201).json({success: true, data: attachment});
    })
    .catch(err => { next(err) })
};

module.exports = {
    getAttachments: getAttachmentsHandler,
    addAttachments: addAttachmentsHandler,
    deleteAttachment: deleteAttachmentHandler,
    getAttachment: getAttachmentHandler,
    uploadFiles: uploadFilesHandler
};

