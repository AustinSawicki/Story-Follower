import api from "../../api";

const UserSortOptionUpdate = async ({option, setSortOption}) => {
    try {
      await api.patch('api/user/update-sort-option/', { sort_option: option })
      .then((res) =>{
        setSortOption(option);
      }) 
    }catch (error) {
      console.error('Error updating sort option:', error);
    }
  };

export default UserSortOptionUpdate