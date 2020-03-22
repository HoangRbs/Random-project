/*eslint-disable*/
import axios from 'axios';

const stripe = Stripe('pk_test_imrdwxDpv4QY4FGEcLp3Um1b00XFsV2PAg');

export const bookTour = async tourId => {
  try {
    const res = await axios(
      `http://localhost:3001/api/bookings/checkout-session/${tourId}`
    );

    const sessionId = res.data.session.id;

    await stripe.redirectToCheckout({
      sessionId: sessionId
    });
  } catch (err) {
    console.log(err);
    alert('err');
  }
};
