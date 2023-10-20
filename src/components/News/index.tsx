import {  useEffect, useState } from 'react';
import {
  Table,
  UnstyledButton,
  Text,
  TextInput,
  rem,
  Button
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import classes from './news.module.css';
import MaterialSymbolsDeleteOutlineRounded from '../icons/MaterialSymbolsDeleteOutlineRounded';
import { getNews } from '../../api/data';
import { TBlogsResults, TCategory } from '../../../types/data';
import { Link } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { axiosPrivate } from '../../api/axiosPrivate';
import toast, { Toaster } from 'react-hot-toast';
import MaterialSymbolsAddRounded from '../icons/MaterialSymbolsAddRounded';
import MaterialSymbolsEditOutlineRounded from '../icons/MaterialSymbolsEditOutlineRounded';
interface ThProps {
  children: React.ReactNode;
}

function Th({ children }: ThProps) {
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton className={classes.control}>
        <Text fw={500} fz="sm">
          {children}
        </Text>
      </UnstyledButton>
    </Table.Th>
  );
}

function shortenText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

export default function NewsItem() {
  const [news, setNews] = useState<TBlogsResults[]>();

  const handleDelete = async (id: number) => {
    
    try {
      await axiosPrivate.delete(`/news/${id}/`)
      toast.success('Movafiqiyatli!')
      fetchData()
    } catch (error) {
      toast.error('O`chirishda xatolik yuz berdi!');
    }
  };


  const fetchData = async () => {
    try {
      const res = await getNews()
      setNews(res?.data.results)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openDeleteModal = (e: TCategory) => {
    modals.openConfirmModal({
      title: e.title,
      centered: true,
      children: (
        <Text size="sm">
          Siz haqiqatan ham bu yangilikni ochirmoqchimisiz
        </Text>
      ),
      labels: { confirm: 'xa', cancel: "yuq" },
      confirmProps: { color: 'red' },
      onConfirm: () => handleDelete(e.id),
    })
  }

  const rows = news && news.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{shortenText(row.title, 24)} </Table.Td>
      <Table.Td>
        <Link to={`/news/edit/${row.id}`}>
          <MaterialSymbolsEditOutlineRounded fontSize={22} color='gold' cursor="pointer" />
        </Link>
      </Table.Td>
      <Table.Td>
        <MaterialSymbolsDeleteOutlineRounded fontSize={22} color='red' cursor="pointer" onClick={() => openDeleteModal(row)} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={classes.news}>
        <div className={classes.wrppaerInputAndBtn}>
          <TextInput
            placeholder="Yangilik boyicha qidiru"
            type='text'
            mb="md"
            w={600}
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          />
          <Link to="/newNews">
            <Button className={classes.addNewNews} color='#6EB648'>
              <MaterialSymbolsAddRounded fontWeight={700} fontSize={22} />
              <Text fw={'normal'}>Yangilik qoshish</Text>
            </Button>
          </Link>

        </div>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Thead>
            <Table.Tr>
              <Th>Id</Th>
              <Th>Title</Th>
              <Th>Tahrirlash</Th>
              <Th>Ochirish</Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>  {rows} </Table.Tbody>
        </Table>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  );
}




