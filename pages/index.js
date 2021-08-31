import { MongoClient } from 'mongodb'
import Head from 'next/head'
import { Fragment } from 'react'
import MeetupList from '../components/meetups/MeetupList'

export default function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta
                    name="description"
                    content="Browse a huge list of highly active React meetings!" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    )
}

export async function getStaticProps() {
    const client = await MongoClient.connect(
        'mongodb+srv://gs650x:Blues123@cluster0.crn1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray()

    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                image: meetup.image,
                description: meetup.description,
                address: meetup.address,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    }
}