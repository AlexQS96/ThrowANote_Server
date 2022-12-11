const Notes = require('../models/Notes');

module.exports = {

    home : (req, res) => {
        res.json({
            msg: 'Throw a Note Server'
        })
    },
    getNotes : async (req, res) => {

        let errorObj = [{id: '404', note: 'No encontre ninguna nota.', privacy: 'error'}]

        if (req.query.search) {
            const paginationSearch = await Notes.find({id : {'$regex': new RegExp(req.query.search, "i")}, privacy : false})

            await Notes.find({id : {'$regex': new RegExp(req.query.search, "i")}, privacy : false}).skip((req.query.page*req.query.notelimit)-req.query.notelimit).limit(req.query.notelimit)
            .then(note => {
                if (note) {
                    return res.json(Object.keys(note).length? [note, paginationSearch.length] : [errorObj,1]);
                }
                else
                {
                    return res.json([errorObj,1])
                }
            });
        }
        else
        {
            
            const pagination = await Notes.find({privacy: false})

            await Notes.find({privacy: false}).skip((req.query.page*req.query.notelimit)-req.query.notelimit).limit(req.query.notelimit)
            .then((note) => {
                if (note) {
                    return res.json(Object.keys(note).length? [note, pagination.length] : [errorObj,1]);
                }
                else
                {
                    return res.json([{id: 'error', note: 'No encontre ninguna nota.', privacy: 'error'},1])
                }
            });
        }
    },
    getNote : async (req, res) => {
        await Notes.findOne({id: req.params.id})
        .then(noteFound => {
            if (noteFound) {
                if (noteFound.privacy) {
                    return res.json({private : true})
                }
                return res.json(noteFound);
            }
            else
            {
                return res.json({id: '404', note: 'Esta nota no existe.'})
            }
        });
    },
    getPrivateNote : async (req, res) => {
        await Notes.findOne({id: req.params.id})
        .then(noteFound => {
            if (req.query.secret === noteFound.keynote) {
                return res.json(noteFound)
            }
            else
            {
                return res.json({id: '403', note: 'Clave Incorrecta.'})
            }
        });
    },
    addNote : async (req, res) => {

        let saveThisNote = {}
        const {noteid, notetext, noteprivacy, notekey} = req.body;

        const verifyNote = await Notes.findOne({id: noteid}).lean();
        
        if(verifyNote || noteid === '404' || noteid === '403'){
          return res
              .status(400)
              .json({
                msg: "Este ID ya existe.",
                type: 1
            });
        }

        if (!noteid) {
            return res
            .status(400)
            .json({
                msg: "Ingresa un ID Valido.",
                type: 1
            });
        }

        if (!notetext) {
            return res
            .status(400)
            .json({
                msg: "La nota no puede estar vacia.",
                type: 2
            });
        }

        if (noteprivacy && !notekey) {
            return res
            .status(400)
            .json({
                msg: "Ingrese una clave valida.",
                type: 3
            });
        }

        
        const fixNote = noteid.split('#').join('')

        saveThisNote = {
            id: fixNote.split(' ').join('_'),
            note: notetext,
            privacy: noteprivacy,
            keynote: notekey
        }

        newNote = new Notes(saveThisNote);

        const noteSaved = await newNote.save();

        if (noteSaved) {
            return res.json({
                msg: "Nota Guardada",
                note: noteSaved
            });
        }
        else{
            return res.status(400).json({
                msg: "Hubo un error al guardar la nota."
            });
        }

    }

}