import { Button, Table } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Result } from '../../../types/v2data';
import { axiosPrivate } from '../../api/axiosPrivate';
import { changeState } from '../../app/features/contentSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import IcBaselineRemoveRedEye from './icons/IcBaselineRemoveRedEye';
import MdiGreasePencil from './icons/MdiGreasePencil';
import SolarTrashBin2Bold from './icons/SolarTrashBin2Bold';


type Props = {
  data: Result[]
}



const TableProducts = ({ data }: Props) => {
  const dispatch = useAppDispatch()
  const { isChange } = useAppSelector((state) => state.changeSlice)
  const navigate = useNavigate()

  const alertDelete = async (id: number) => {
    Swal.fire({
      title: "Mahsulotni o'chirmoqchimisiz?",
      text: "Keyin qayta tiklay olmasligingiz mumkin!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Ha, o'chirmoqchiman!"
    }).then((result) => {
      axiosPrivate.delete(`/products/${id}/`).then(() => {
        if (result.isConfirmed) {
          dispatch(changeState(!isChange))
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    })
  }


  return (
    <div>
      <Table.ScrollContainer minWidth={500}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>TR</Table.Th>
              <Table.Th>Element name</Table.Th>
              <Table.Th>Symbol</Table.Th>
              <Table.Th>Kategoriya</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>

            {data.map((item, index) => (
              <Table.Tr key={item.id}>
                <Table.Td w={20}>{index + 1}</Table.Td>
                <Table.Td>{item.title}</Table.Td>
                <Table.Td w={100}>{item.product_type}</Table.Td>
                <Table.Td w={300}>{item.subcategory.category.title} / {item.subcategory.title}</Table.Td>
                <Table.Td w={200}>
                  <Button mr={2} px={10} onClick={() => navigate(`/products/see/${item.id}`)} variant="default">
                    <IcBaselineRemoveRedEye />
                  </Button>

                  <Button ml={2} px={10} variant="default" onClick={() => alertDelete(item.id)}>
                    <SolarTrashBin2Bold />
                  </Button>

                  <Button ml={2} px={10} onClick={() => navigate(`/products/edit/${item.id}`)} variant="default">
                    <MdiGreasePencil />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}

          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  )
}

export default TableProducts