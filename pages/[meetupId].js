import MeetupDetail from "../components/meetups/MeetupDetail";
import { Fragment } from 'react'
import Head from 'next/head'
import { MongoClient, ObjectId } from "mongodb";

export default function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" context={props.meetupData.description} />
            </Head>
            <MeetupDetail
                {...props.meetupData} />
        </Fragment>
    )
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://gs650x:Blues123@cluster0.crn1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map((meetup) => ({
            params: { meetupId: meetup._id.toString() },
        })),
    };
}

export async function getStaticProps(context) {
    // fetch data for a single meetup

    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(
        'mongodb+srv://gs650x:Blues123@cluster0.crn1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({
        _id: ObjectId(meetupId),
    });

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            },
        },
    };
}
