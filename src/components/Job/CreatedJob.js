import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row ,Spinner} from "react-bootstrap";
import { useParams } from "react-router-dom";
import Receiver from "./Receiver";



const CreatedJob = () => {
    const { id } = useParams();

    const [job, setJob] = useState({});
    const [receivers, setReceivers] = useState(null)
    const [authenticated, setAuthenticated] = useState(JSON.parse(localStorage.getItem("authenticated")));
    const base_url = "https://my-happy-farmer.herokuapp.com/api/v1";

    let headers = {
        'Authorization': "Bearer " + authenticated.token,
        'Content-Type': 'application/json'
    };


    useEffect(async () => {
        await axios.get(base_url + "/job/createdJob/" + id, { headers })
            .then(res => res.data)
            .then(data => {
                console.log(data.data)
                setJob(data.data.job);
                setReceivers(data.data.receivers);

            }).catch(err => { throw Error(err) });
    }, []);

    return (
        <Container>


            {

                receivers != null ?
                    <Row>
                        <Col>
                            <h1>Created Job </h1>
                            <div>
                                <div><h3>Job detail</h3>

                                    <p>{job.id}</p>
                                    <p>{job.name}</p>
                                    <p>{job.image_url}</p>
                                    <p>{job.description}</p>
                                    <p>{job.status}</p>

                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div><h3>Receivers</h3>
                                {
                                    receivers.map((receiver, idx) => {

                                        return <Receiver key={idx} job={job.id} authenticated={authenticated} receiver={receiver} />
                                    })
                                }
                            </div>
                        </Col>
                    </Row> :
                    <Spinner animation="border" role="status" variant="success">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
            }



        </Container>

    )
}
export default React.memo(CreatedJob);