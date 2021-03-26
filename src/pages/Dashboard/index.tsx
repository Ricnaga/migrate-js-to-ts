import { useEffect, useState } from "react";
import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';
import { IFood } from "../../types";
import { FoodsContainer } from './styles';

export default function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood)

  useEffect(() => {
    api.get('/foods').then(response =>
      setFoods(response.data)
    )
  }, [])

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleAddFood = async (food: IFood) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered)
  }

  const handleEditFood = (food: IFood) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  const handleUpdateFood = async (food:IFood) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        setIsOpen={toggleModal}
        isOpen={modalOpen}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}