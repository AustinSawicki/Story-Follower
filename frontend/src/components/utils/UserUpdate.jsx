import api from "../../api";

function UserUpdate({updateData}) {
    api.patch(`/api/users/me`, updateData)
    .then((res) => {
        if (res.status === 200) {
        } else {
            console.log('Failed to update user.');
        }
    }).then(() => {
        onClose();
    })
    .catch((err) => alert(err));
}

export default UserUpdate