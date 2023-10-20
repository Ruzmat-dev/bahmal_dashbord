import { useCallback, useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    UnstyledButton,
    Text,
    Button,
    TextInput
} from '@mantine/core';
import classes from './see.module.css';
import MaterialSymbolsDeleteOutlineRounded from '../../icons/MaterialSymbolsDeleteOutlineRounded';
import { getSubCategory } from '../../../api/data';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { axiosPrivate } from '../../../api/axiosPrivate';
import toast, { Toaster } from 'react-hot-toast';
import { SubCategory } from '../../../../types/data';
import MaterialSymbolsAddRounded from '../../icons/MaterialSymbolsAddRounded';
import MaterialSymbolsEditOutlineRounded from '../../icons/MaterialSymbolsEditOutlineRounded';
import MaterialSymbolsArrowBackRounded from '../../icons/MaterialSymbolsArrowBackRounded';
import TwemojiFlagUzbekistan from '../../icons/TwemojiFlagUzbekistan';
import TwemojiFlagRussia from '../../icons/TwemojiFlagRussia';
import FxemojiGreatbritainflag from '../../icons/FxemojiGreatbritainflag';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AxiosError } from 'axios';
interface ThProps {
    children: React.ReactNode;
}

type FormData = {
    title_uz?: string;
    title_ru?: string;
    title_en?: string;
};


const schema = yup
    .object({
        title_ru: yup.string(),
        title_uz: yup.string(),
        title_en: yup.string(),
    })
    .required()

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

export default function CategoriesSee() {
    const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
    const [parentName, setParentName] = useState<string>("")
    const { register, handleSubmit } = useForm<FormData>({ resolver: yupResolver(schema) })
    
    const { id } = useParams()
    const navigate = useNavigate();
  
    const handleDelete = async (id: number) => {
        try {
            await axiosPrivate.delete(`/subcategories/${id}/`)
            toast.success('Movafiqiyatli!')
            fetchSubs()
        } catch (error) {
            toast.error('O`chirishda xatolik yuz berdi!');
        }
    };

    
    const fetchSubs = useCallback(async () => {
        if (id) {
            const res_uz = await getSubCategory(id, "uz")
            if (res_uz) {
                setSubCategory(res_uz.data)
            }
            res_uz?.data.map((e) => {
                setParentName(e.category.title)
            })
        }

    }, [id])

    useEffect(() => {
        fetchSubs()
    }, [fetchSubs])


    const openDeleteModal = (e: SubCategory) => {
        modals.openConfirmModal({
            title: e.title,
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


    const onSubmit = async (data: FormData) => {
        const new_data = { ...data, title: data.title_uz, category: Number(id) }

        try {
            await axiosPrivate.post('/subcategories/', new_data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Movafiqiyatli Qoshildi!')
            fetchSubs()
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(error);

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
        modals.closeAll()
    }



    const rows = subCategory && subCategory.map((row) => (
        <Table.Tr key={row.id}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.title} </Table.Td>
            <Table.Td>
                <Link to={`/categories/add/${row.id}`}>
                    <MaterialSymbolsEditOutlineRounded fontSize={22} color='gold' cursor="pointer" />
                </Link>
            </Table.Td>
            <Table.Td>
                <MaterialSymbolsDeleteOutlineRounded fontSize={22} color='red' cursor="pointer" onClick={() => openDeleteModal(row)} />
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className={classes.catalog}>
            <ScrollArea>
                <div className={classes.wrppaerInputAndBtn}>
                    <div className={classes.goBackBtn} onClick={() => navigate(-1)}>
                        <Button size="md" leftSection={<MaterialSymbolsArrowBackRounded />} bg="#6EB648" className={classes.goBackBtn}>
                            Chiqish
                        </Button>
                    </div>
                    <Text c="#6EB648" size='xl' fw={'initial'}> {parentName ?? "No Data"} </Text>
                    <Button className={classes.addNewCategory} color='#6EB648'
                        onClick={() => {
                            modals.open({
                                title: 'Yangi catalog qoshish',
                                children: (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <TextInput
                                            label={
                                                <span className={classes.inputLabelStyle}>
                                                    <span >Nomi</span> <TwemojiFlagUzbekistan fontSize={18} />
                                                </span>
                                            }
                                            {...register("title_uz")}
                                            placeholder="Nomi" data-autofocus
                                        />

                                        <TextInput
                                            label={
                                                <span className={classes.inputLabelStyle}>
                                                    <span >Названия</span> <TwemojiFlagRussia fontSize={18} />
                                                </span>
                                            }
                                            {...register("title_ru")}
                                            placeholder="Названия" data-autofocus
                                            style={{ paddingTop: "20px", paddingBottom: "20px" }}
                                        />

                                        <TextInput
                                            label={
                                                <span className={classes.inputLabelStyle}>
                                                    <span >Title</span> <FxemojiGreatbritainflag fontSize={18} />
                                                </span>
                                            }
                                            {...register("title_en")}
                                            placeholder="Title" data-autofocus
                                        />

                                        <Button bg="#6EB648" fullWidth type='submit' mt="md">
                                            Yuborish
                                        </Button>
                                    </form>
                                ),
                            });
                        }}
                        >
                        <MaterialSymbolsAddRounded fontWeight={700} fontSize={22} />
                        Yangi Categorya qoshish
                    </Button>

                </div>
                <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                    <Table.Tbody>
                        <Table.Tr>
                            <Th>Id</Th>
                            <Th>Title</Th>
                            <Th>Qoshish</Th>
                            <Th>Ochirish</Th>
                        </Table.Tr>
                    </Table.Tbody>
                    <Table.Tbody>
                        {rows && rows}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
}
