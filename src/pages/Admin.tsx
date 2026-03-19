import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useIsMobile } from '../hooks/use-is-mobile'

interface Rendezvous {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  service: string;
  price: string;
  date: string;
}

const Admin: React.FC = () => {
  const isMobile = useIsMobile()
  const [data, setData] = useState<Rendezvous[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // --- ÉTATS POUR LA SÉCURITÉ ---
  const [isAuth, setIsAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const SECRET_PASSWORD = "BOSSLADY225THBBS@"; 

  const loadData = async () => {
    let query = supabase.from("rendezvous").select("*");

    if (filterDate) {
      query = query.eq("date", filterDate);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (!error) setData(data || []);
  };

  useEffect(() => {
    // On ne charge les données que si l'utilisateur est authentifié
    if (isAuth) {
      loadData();
    }
  }, [filterDate, isAuth]);

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    const { error } = await supabase
      .from("rendezvous")
      .delete()
      .eq("id", selectedId);

    if (!error) {
      setShowModal(false);
      setSelectedId(null);
      setSuccessMessage(true);
      loadData();

      setTimeout(() => setSuccessMessage(false), 3000);
    }
  };

  // --- ÉCRAN DE CONNEXION ---
  if (!isAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#fdfbf7", padding: "20px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "400px" }}>
          <h2 style={{ color: "#a67c00", marginBottom: "20px", fontFamily: 'sans-serif' }}>Accès Admin Spa</h2>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "20px" }}>Veuillez saisir le mot de passe pour voir les rendez-vous.</p>
          <input 
            type="password" 
            placeholder="Mot de passe" 
            style={{ width: "100%", padding: "15px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }} 
            onChange={(e) => setPassInput(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && (passInput === SECRET_PASSWORD ? setIsAuth(true) : alert("Accès refusé"))}
          />
          <button 
            onClick={() => passInput === SECRET_PASSWORD ? setIsAuth(true) : alert("Accès refusé")} 
            style={{ width: "100%", padding: "15px", background: "#a67c00", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // --- CONTENU ADMIN (Visible uniquement après connexion) ---
  return (
    <div className="admin-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="admin-title">Gestion des Rendez-vous</h1>

      {successMessage && (
        <div className="success-delete" style={{ color: "green", fontWeight: "bold", marginBottom: "15px" }}>
          ✅ Rendez-vous supprimé avec succès
        </div>
      )}

      <div className="filter-box" style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Filtrer par date :</label>
        <input
          type="date"
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Rendu conditionnel pour Mobile si besoin, sinon affichage tableau classique */}
      <div style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f1e5" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Prénom</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Numéro</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Service</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Prix</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{r.nom}</td>
                  <td style={{ padding: "12px" }}>{r.prenom}</td>
                  <td style={{ padding: "12px" }}>{r.telephone}</td>
                  <td style={{ padding: "12px" }}>{r.email}</td>
                  <td style={{ padding: "12px" }}>{r.service}</td>
                  <td style={{ padding: "12px" }}>{Number(r.price)?.toLocaleString()} FCFA</td>
                  <td style={{ padding: "12px" }}>{r.date}</td>
                  <td style={{ padding: "12px" }}>
                    <button
                      className="delete-btn"
                      style={{ background: "#ff4d4d", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
                      onClick={() => openDeleteModal(r.id)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/* MODALE DE SUPPRESSION */}
      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-box" style={{ background: "white", padding: "25px", borderRadius: "15px", textAlign: "center", maxWidth: "400px" }}>
            <h3>Confirmer la suppression</h3>
            <p>Voulez-vous vraiment supprimer ce rendez-vous ?</p>

            <div className="modal-buttons" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="cancel-btn"
                style={{ flex: 1, padding: "10px", background: "#eee", border: "none", borderRadius: "5px" }}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              <button
                className="confirm-delete-btn"
                style={{ flex: 1, padding: "10px", background: "#ff4d4d", color: "white", border: "none", borderRadius: "5px" }}
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;



