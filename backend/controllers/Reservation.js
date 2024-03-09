import Achat from "../models/Clients.js";
import Game from "../models/Reservation.js";
import User from "../models/Parking.js";
import Reservation from "../models/Reservation.js";

export function reservedPlace(req, res) {
    Parking.findById(req.params.idp)
    .then((parking) => {
      if (parking.nbFreePlaces > 0) {
        Clients.findById(req.params.idc)
          .then((client) => {
              Reservation.create({
                idc: req.params.idc,
                idp: req.params.idp,
              })
                .then((reservation) => {
                    Parking.findByIdAndUpdate(req.params.idp, {
                    nbFreePlaces: parking.nbFreePlaces - 1,
                  })
                    .then((doc1) => {
                          res.status(200).json(reservation);
                    })
                    .catch((err) => {
                      res.status(500).json({ error: err });
                    });
                })
                .catch((err) => {
                  res.status(500).json({ error: err });
                });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      } else {
        res.status(200).json({ message: "il nya pas de places disponnible !" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

