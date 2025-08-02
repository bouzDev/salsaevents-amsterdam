// import configPromise from '@payload-config';
// import { getPayload } from 'payload';

export const GET = async () => {
    // Example route - payload could be used here for data fetching
    // const payload = await getPayload({
    //   config: configPromise,
    // })

    return Response.json({
        message: 'This is an example of a custom route.',
    });
};
