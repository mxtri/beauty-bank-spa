import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const CategoryHeader = ({ initialName, onRename, onAddService }: any) => {
  const [localName, setLocalName] = useState(initialName);
  return (
    <div style={{ background: "#fcfaf5", padding: "15px", borderBottom: "1px solid #eee", display: "flex", flexDirection: "column", gap: "10px" }}>
      <input 
        style={{ background: "transparent", border: "none", borderBottom: "2px solid #d4af37", color: "#8a6d1a", fontSize: "1.1rem", fontWeight: "bold", textTransform: "uppercase", padding: "8px 0", outline: "none" }}
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onBlur={() => { if (localName !== initialName) onRename(initialName, localName); }}
      />
      <button type="button" onClick={() => onAddService(initialName)} style={{ background: "#a67c00", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
        + Ajouter un soin à cette catégorie
      </button>
    </div>
  ); 
};

const ChangeCatalogue: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const SECRET_PASSWORD = "Proprio225THBBS"; 

  useEffect(() => { if(isAuth) fetchList(); }, [isAuth]);

  const fetchList = async () => {
    const { data } = await supabase.from("catalogue").select("*").order("categorie", { ascending: true });
    if (data) setList(data);
  };

  const updateEntry = async (id: string, field: string, value: string) => {
    await supabase.from("catalogue").update({ [field]: value }).eq("id", id);
  };

  const renameCategory = async (oldName: string, newName: string) => {
    if (!newName.trim()) return;
    await supabase.from("catalogue").update({ categorie: newName }).eq("categorie", oldName);
    fetchList();
  };

  const addNewService = async (categoryName: string = "NOUVELLE CATÉGORIE") => {
    // INSERTION EXPLICITE
    const { error } = await supabase.from("catalogue").insert([
      { categorie: categoryName, service: "Nouveau soin", prix: "0 FCFA", duree: "1h" }
    ]);
    if (error) alert("Erreur : " + error.message);
    else fetchList();
  };

  const executeDelete = async () => {
    if (itemToDelete) {
      await supabase.from("catalogue").delete().eq("id", itemToDelete);
      setShowModal(false); setItemToDelete(null); fetchList();
    }
  };

  if (!isAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#fdfbf7", padding: "20px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "400px" }}>
          <h2 style={{ color: "#a67c00", marginBottom: "20px" }}>Gestion Spa</h2>
          <input type="password" placeholder="Mot de passe" style={{ width: "100%", padding: "15px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "16px" }} onChange={(e) => setPassInput(e.target.value)} />
          <button onClick={() => passInput === SECRET_PASSWORD ? setIsAuth(true) : alert("Accès refusé")} style={{ width: "100%", padding: "15px", background: "#a67c00", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Entrer</button>
        </div>
      </div>
    );
  }

  const categories = list.reduce((acc: any, item: any) => {
    if (!acc[item.categorie]) acc[item.categorie] = [];
    acc[item.categorie].push(item);
    return acc;
  }, {});

  return (
    <div style={{ padding: "15px", maxWidth: "800px", margin: "0 auto", fontFamily: 'sans-serif', paddingBottom: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h1 style={{ color: "#a67c00", fontSize: "1.5rem", margin: 0 }}>Gestion Tarifs</h1>
        <button onClick={() => addNewService()} style={{ padding: "10px 15px", background: "#a67c00", color: "white", border: "none", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>+ Catégorie</button>
      </div>

      {Object.keys(categories).map((catName) => (
        <div key={catName} style={{ marginBottom: "30px", background: "#fff", border: "1px solid #f0e6d2", borderRadius: "15px", overflow: "hidden" }}>
          <CategoryHeader initialName={catName} onRename={renameCategory} onAddService={addNewService} />
          <div style={{ padding: "15px" }}>
            {categories[catName].map((item: any) => (
              <div key={item.id} style={{ background: "#fdfdfd", padding: "15px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #f5f5f5" }}>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "0.7rem", color: "#aaa" }}>Nom du soin</label>
                  <input style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #eee" }} value={item.service} onChange={(e) => {
                    const val = e.target.value;
                    setList(list.map(l => l.id === item.id ? {...l, service: val} : l));
                    updateEntry(item.id, "service", val);
                  }} />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "0.7rem", color: "#aaa" }}>Durée</label>
                    <input style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #eee" }} value={item.duree || ""} onChange={(e) => {
                      const val = e.target.value;
                      setList(list.map(l => l.id === item.id ? {...l, duree: val} : l));
                      updateEntry(item.id, "duree", val);
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "0.7rem", color: "#aaa" }}>Prix</label>
                    <input style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #eee", fontWeight: "bold", color: "#a67c00" }} value={item.prix} onChange={(e) => {
                      const val = e.target.value;
                      setList(list.map(l => l.id === item.id ? {...l, prix: val} : l));
                      updateEntry(item.id, "prix", val);
                    }} />
                  </div>
                </div>
                <button onClick={() => { setItemToDelete(item.id); setShowModal(true); }} style={{ marginTop: "15px", width: "100%", padding: "10px", background: "#fff1f1", color: "#ff4d4d", border: "1px solid #ffcccc", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "25px", borderRadius: "20px", width: "90%", maxWidth: "320px", textAlign: "center" }}>
            <p style={{ fontWeight: "bold" }}>Confirmer ?</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#f0f0f0" }}>Non</button>
              <button onClick={executeDelete} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#ff4d4d", color: "white" }}>Oui</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeCatalogue;