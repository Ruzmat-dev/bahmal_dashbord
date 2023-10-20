import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form';
import { getStatistics, getStatisticsById } from "../../api/data"
import { Table, Text, Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TStatistics } from "../../../types/data";
import { modals } from '@mantine/modals';
import classes from "./statistic.module.css"
import MaterialSymbolsEditOutlineRounded from "../icons/MaterialSymbolsEditOutlineRounded";
import MaterialSymbolsDeleteOutlineRounded from "../icons/MaterialSymbolsDeleteOutlineRounded";
import MaterialSymbolsAddRounded from "../icons/MaterialSymbolsAddRounded";
import { axiosPrivate } from "../../api/axiosPrivate";
import toast, { Toaster } from 'react-hot-toast';
import TwemojiFlagUzbekistan from "../icons/TwemojiFlagUzbekistan";
import TwemojiFlagRussia from "../icons/TwemojiFlagRussia";
import FxemojiGreatbritainflag from "../icons/FxemojiGreatbritainflag";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import { AxiosError } from "axios";

interface FormValues {
  number: number,
  body_ru: string,
  body_en: string,
  body_uz: string,
}

const schema = yup
  .object({
    number: yup.number().required("Iltimos bu joyni toldirig").min(1),
    body_ru: yup.string().required("Iltimos bu joyni toldirig"),
    body_en: yup.string().required("Iltimos bu joyni toldirig"),
    body_uz: yup.string().required("Iltimos bu joyni toldirig"),
  })
  .required("Iltimos bu joyni toldirig")

const StatisticItem = () => {

  const [statisrics, setStaristics] = useState<TStatistics[]>()
  const [opened, { open, close }] = useDisclosure(false);

  const fetchStatistics = async () => {
    const res = await getStatistics()
    setStaristics(res?.data);
  }

  const handleDelete = async (id: number) => {
    try {
      await axiosPrivate.delete(`/statistics/${id}/`)
      toast.success('Movafiqiyatli Ochirildi!')
      fetchStatistics()
    } catch (error) {
      toast.error('O`chirishda xatolik yuz berdi!');
    }
  };

  useEffect(() => {
    fetchStatistics()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const new_data = {...data , body: data.body_uz}
    try {
      await axiosPrivate.post('/statistics/', new_data)
      toast.success('Movafiqiyatli Qoshildi!')
      fetchStatistics()
      close()
    } catch (error) {
      const axiosError = error as AxiosError;
      const myError = axiosError.request?.status ?? 0;
      const errorNumber = Math.floor(myError / 100);
      if (errorNumber === 4) {
        toast.error('Xato malumot kiritildi!');
      } else if (errorNumber === 5) {
        toast.error('Uzir hatoliq yuz berdi!');
      } else {
        toast.error('Internet aloqasi yo`q!');
      }
    }
  }

  const editStatistics = async (id: number) => {

    const res = await getStatisticsById(id)

    console.log(res?.data);
    
    modals.open({
      title: 'Subscribe to newsletter',
      children: (
        <>
          <TextInput label="Your email" placeholder="Your email" data-autofocus />
          <Button fullWidth  mt="md">
            Submit
          </Button>
        </>
      ),
    });
    // modals.closeAll()
  } 

  const openDeleteModal = (e: TStatistics) => {
    modals.openConfirmModal({
      centered: true,
      children: (
        <Text size="sm">
          Siz haqiqatan ham bu mahsulotni ochirmoqchimisiz
        </Text>
      ),
      labels: { confirm: 'xa', cancel: "yuq" },
      confirmProps: { color: 'red' },
      onConfirm: () => handleDelete(e.id),
    })
  }


  const rows = statisrics && statisrics.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.number}</Table.Td>
      <Table.Td>{element.body}</Table.Td>
      <Table.Td>
        <MaterialSymbolsEditOutlineRounded fontSize={22} color='gold' cursor="pointer" 
         onClick={() => {
          editStatistics(element.id)
        }}
        />
      </Table.Td>
      <Table.Td>
        <MaterialSymbolsDeleteOutlineRounded fontSize={22} color='red' cursor="pointer" onClick={() => openDeleteModal(element)} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
        <Modal opened={opened} onClose={close} title="Yangi Statistika koshish">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            data-autofocus
            label={
              <span style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                <span >Nomi</span> <TwemojiFlagUzbekistan fontSize={18} />
              </span>
            }
            {...register("body_uz")}
            error={errors.body_uz?.message}
            placeholder="Mahsulot nomin yozig"
            mt="md"
          />
          <TextInput
            data-autofocus
            label={
              <span style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                <span >Названия</span> <TwemojiFlagRussia fontSize={18} />
              </span>
            }
            {...register("body_ru")}
            error={errors.body_ru?.message}
            placeholder="Називания"
            mt="md"
          />
          <TextInput
            data-autofocus
            label={
              <span style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                <span >Title</span> <FxemojiGreatbritainflag fontSize={18} />
              </span>
            }
            {...register("body_en")}
            error={errors.body_en?.message}
            placeholder="Title"
            mt="md"
          />
          <TextInput
            type="number"
            label="Soni"
            placeholder="Mahsulot soni"
            {...register("number")}
            error={errors.number?.message}
          />
          <div className={classes.btnWrapp}>
            <Button bg="#6EB648" className={classes.send} type='submit'> Yuborish </Button>
          </div>
        </form>
      </Modal>


      
    <div className={classes.statisric}>

      <div className={classes.headerForm}>
        <Text c="#6EB648" size='xl' fw={'initial'}>Statistika</Text>

        <div >
          <Button className={classes.addNewStatistic} color='#6EB648' size="md" onClick={open}>
            <MaterialSymbolsAddRounded fontWeight={700} fontSize={22} />
            <Text fw={'normal'} fs="48">Statistika qoshish</Text>
          </Button>
        </div>
      </div>

      <Table className={classes.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Soni</Table.Th>
            <Table.Th>Nomi</Table.Th>
            <Table.Th>Tahlillash</Table.Th>
            <Table.Th>Ochirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
    </>
  )
}

export default StatisticItem