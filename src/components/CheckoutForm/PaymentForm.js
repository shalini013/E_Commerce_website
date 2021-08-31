import React from 'react'
import Review from './Review';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51IiBj0SEwyIlVjQ9eWlIMk86sd6tWiavFlzGjx5Ka6XzDghg5s7tvEyUZgFLcv6mkDDdrLszfFGn2bZr9EJiFK8Z00D9SyK2wF')

const PaymentForm = ({ shippingData, checkoutToken, backStep ,onCaptureCheckout,nextStep, timeOut}) => {
    console.log(shippingData);
    console.log(checkoutToken);

    const handleSubmit = async ( event, elements, stripe) =>{
        event.preventDefault();
        console.log(stripe,elements)
        if(!stripe || !elements) return;
        const cardElement = elements.getElement(CardElement);
        const {error, paymentMethod} = await stripe.createPaymentMethod({type:'card', card:cardElement})

    if(error){
        console.log(error)
    }else{
        const orderData = {
            line_items : checkoutToken.live.line_items,
            customer : {firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email},
            shipping :{
                name : 'International',
                street : shippingData.address,
                city_town : shippingData.city,
                country_state : shippingData.shippingSubdivision,
                postal_zip_code : shippingData.zip,
                country: shippingData.shippingCountry
            },
            fullfilment:{shipping_option : shippingData.shippingOption},
            payment : {
                gateway : 'stripe',
                paymentmethod : {
                    payment_method_id : paymentMethod.id
                }
            }

        }
        onCaptureCheckout(checkoutToken.id, orderData);
        timeOut();
        nextStep();
    }

    }

    return (
        <>
            <Review checkoutToken={checkoutToken} />
            <Divider />
            <Typography variant='h6' gutterBottom>Payment Methods</Typography>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement />
                            <br /> <br />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant='outlined' onClick={backStep}> Back</Button>
                                <Button variant='contained' type='submit' color='primary' disabled={!stripe}> pay {checkoutToken.live.subtotal.formatted_with_symbol}</Button>

                            </div>
                        </form>
                    )}
                </ElementsConsumer>

            </Elements>
        </>
    )
}

export default PaymentForm;