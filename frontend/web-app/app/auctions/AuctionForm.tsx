'use client';

import { Button, Spinner } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/auctionActions';
import toast from 'react-hot-toast';
import { Auction } from '@/types';

type Props = {
    auction?: Auction;
}

export default function AuctionForm({auction}: Props) {
    const { control, handleSubmit, setFocus, reset,
        formState: { isSubmitting, isValid, isDirty } } = useForm({
            mode: 'onTouched'
        });
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (auction) {
            const {make, model, color, mileage, year} = auction;
            reset({make, model, color, mileage, year})
        }
        setFocus('make')
    }, [setFocus, auction, reset])

    async function onSubmit(data: FieldValues) {
        try {
            let id = '';
            let res;
            if (pathname === '/auctions/create') {
                res = await createAuction(data); 
                id = res.id;
            } else {
                if (auction) {
                    res = await updateAuction(data, auction.id);
                    id = auction.id;
                }
            }                       
            if (res.error) {
                throw res.error;
            }
            router.push(`/auctions/details/${id}`);
        } catch (error: any) {
            toast.error(error.status + ' ' + error.message);
        }
    }
    return (
        <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
            <Input name="make" label='Make' control={control} rules={{ required: 'Make is required' }} />
            <Input name="model" label='Model' control={control} rules={{ required: 'Model is required' }} />
            <Input name="color" label='Color' control={control} rules={{ required: 'Color is required' }} />
            <div className='grid grid-cols-2 gap-3'>
                <Input name="year" label='Year' type='number' control={control} rules={{ required: 'Year is required' }} />
                <Input name="mileage" label='Mileage' type='number' control={control} rules={{ required: 'Mileage is required' }} />
            </div>
            {pathname === '/auctions/create' &&
            <>
            <Input name="imageUrl" label='Image URL' control={control} rules={{ required: 'Image URL is required' }} />

            <div className='grid grid-cols-2 gap-3'>
                <Input name="reservePrice" label='Reserve Price (enter 0 if no reserve)' type='number' control={control} rules={{ required: 'Reserve price is required' }} />
                <DateInput name="auctionEnd" 
                            showTimeSelect
                            dateFormat='dd MMMM yyyy h:mm a'
                            label='Auction data/time' control={control} 
                            rules={{ required: 'Auction end date is required' }} />
            </div>
            </>}
            <div className='flex justify-between'>
                <Button color='alternative' onClick={() => router.push('/')}>Cancel</Button>
                <Button outline
                    color='green'
                    type='submit'
                    disabled={!isValid || !isDirty}>
                    {isSubmitting && <Spinner size='sm' />}
                    Submit
                </Button>
            </div>
        </form>
    )
}
