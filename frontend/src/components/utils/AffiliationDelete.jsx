import api from "../../api";

function AffiliationDelete({ids, affiliations, setAffiliations, setInputs, inputs}) {
    api.delete(`/api/stories/${ids[0]}/affiliations/${ids[1]}/delete/`)
        .then(() => {
            setAffiliations(affiliations.filter((affil) => affil.id !== ids[1]));
            if (inputs.affiliation === ids[1]) {
                setInputs({ ...inputs, affiliation: null });
            }
        })
        .catch((error) => {
            console.error('Error deleting affiliation:', error);
        });
};

export default AffiliationDelete