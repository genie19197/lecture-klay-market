import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faPlus } from "@fortawesome/free-solid-svg-icons";

import { Alert, Button, Jumbotron, Nav, NavItem, NavLink, Card, CardColumns, Row, Col, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./market.css";
import QRCode from "qrcode.react";
import { setCount, getBalance, fetchCardsOf, mintCardWithURI, listingCard, buyCard } from "./api/UseCaver";

import * as Klip from "./api/UseKlip";

// let myCards = ["1", "2", "3"];
// let marketCards = ["a", "b", "c"];
const addr = "0xfd0ec544716f204b6d3a541df4266a7945e5c1c5";
const privatekey = "0x64e34d461bdda5693f8f34e909267d1066519845e033462a2e7416ebcb058647";
function AppView() {
  const imgUrl = "https://i.pinimg.com/originals/c9/4e/c8/c94ec894c1bbe63c97ad5345e37e45e3.jpg";
  const [nfts, setNfts] = useState([
    "https://t1.daumcdn.net/cfile/blog/994DF5465C8F52662F",
    "https://mblogthumb-phinf.pstatic.net/20140318_57/dohnynose_1395087760818IaqaS_JPEG/T05010_10.jpg?type=w2",
    imgUrl,
    "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/bsnE/image/nylZCCGs_ECbY3qFxzL1Xpr1PDs.JPG",
    "https://www.straightnews.co.kr/news/photo/201902/42677_18747_2551.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjgb1iboZ9DwZRlvQW95TazehBFcEws5vk6Q&usqp=CAU",
  ]);
  const [tab, setTab] = useState("MARKET");
  const [mintImageUrl, setMintImageUrl] = useState("");
  const rows = nfts.slice(nfts.length / 2);
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "타이틀",
    onConfirm: () => {
      console.log("sdffsdf");
    },
  });
  return (
    <div style={{ backgroundColor: "black", padding: 10 }}>
      <div style={{ fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>내 지갑</div>
      <br />
      <Alert variant={"balance"} style={{ backgroundColor: "#f40075", fontSize: 30 }}>
        99.9 KLAY
      </Alert>
      <div style={{ color: "#EEEEEE", fontSize: 25, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>전체</div>
      {tab === "MARKET" || tab === "WALLET" ? (
        <div className="container" style={{ padding: 0, width: "100%" }}>
          {rows.map((o, rowIndex) => (
            <Row>
              <Col style={{ marginRight: 0, paddingRight: 0 }}>
                <Card
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <Card.Img src={nfts[rowIndex * 2]} />
                </Card>
                구매하기
              </Col>
              <Col>
                <Card>
                  <Card.Img src={nfts[rowIndex * 2 + 1]} />
                </Card>
                구매하기
              </Col>
            </Row>
          ))}
          <br />
          <br />
          <br />
        </div>
      ) : null}

      {/* MINT */}
      {tab === "MINT" ? (
        <div className="container" style={{ padding: 0, width: "100%" }}>
          <Card className="text-center" style={{ color: "black", height: "50%" }}>
            <Card.Header as="h5">NEW CARD</Card.Header>
            <Card.Body>
              {mintImageUrl !== "" ? <Card.Img src={mintImageUrl} height={"50%"} /> : null}
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    value={mintImageUrl}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setMintImageUrl(e.target.value);
                    }}
                    type="text"
                    placeholder="이미지 주소를 입력해주세요"
                  />
                  <Form.Text className="text-muted">블록체인에 발행됩니다.</Form.Text>
                </Form.Group>
                <Button variant="primary">발행하기</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      ) : null}

      <Modal
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>{modalProps.title}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              modalProps.onConfirm();
            }}
          >
            진행
          </Button>
        </Modal.Footer>
      </Modal>
      <nav style={{ backgroundColor: "#BBBBBB", height: 45 }} className="navbar fixed-bottom navbar-light" role="navigation">
        <Nav className="w-100">
          <div className=" d-flex flex-row justify-content-around w-100">
            <div
              onClick={() => {
                setTab("MARKET");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faHome} />
              </div>
            </div>
            <div
              onClick={() => {
                setTab("MINT");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faPlus} />
              </div>
            </div>
            <div
              onClick={() => {
                setTab("WALLET");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faWallet} />
              </div>
            </div>
          </div>
        </Nav>
      </nav>
    </div>
  );
}
function App() {
  const [nfts, setNfts] = useState([]);
  const [type, setType] = useState("MARKET");
  const [balance, setBalance] = useState("0");
  const [address, setAddress] = useState("0x0000000000000000000000000000000000000000");
  const [qrvalue, setQrvalue] = useState("default");
  // const [env, setEnv] = useState("MOBILE");
  // const [myAddress, setMyAddress] = useState("DEFAULT_ADDRESS");
  useEffect(() => {
    setNfts(["ART⌂🏠", "TESLA", "APPLE👛"]);
    // getBalance("0xfd0ec544716f204b6d3a541df4266a7945e5c1c5");
    // fetchCardsOf(addr);
    // mintCardWithURI(addr, "104", "cool", privatekey);
  }, []);
  return (
    <div className="App">
      <AppView />
      {/* <div>
        <div className="cards-list">
          <button
            onClick={() => {
              // listingCard("100", privatekey);
              Klip.listingCard(
                "0x5536F6FaB59Ff40cEce71D58BD94983BFc52E7A4",
                "110",
                setQrvalue,
                (result) => {
                  console.log(`[MINT CallBack]${JSON.stringify(result)}`);
                }
              );
            }}
          >
            LISTING CARD
          </button>
          <button
            onClick={() => {
              // buyCard("100", privatekey);
              Klip.buyCard("110", setQrvalue, (result) => {
                console.log(`[MINT CallBack]${JSON.stringify(result)}`);
              });
            }}
          >
            BUY CARD
          </button>
          <button
            style={{ backgroundColor: "yellow" }}
            onClick={() => {
              Klip.mintCardWithURI(
                "0x5536F6FaB59Ff40cEce71D58BD94983BFc52E7A4",
                "110",
                "https://i.pinimg.com/originals/c9/4e/c8/c94ec894c1bbe63c97ad5345e37e45e3.jpg",
                setQrvalue,
                (result) => {
                  console.log(`[MINT CallBack]${JSON.stringify(result)}`);
                }
              );
            }}
          >
            Mint Card
          </button>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => {
              Klip.getAddress(setQrvalue, async (address) => {
                setAddress(address);
                const bal = await getBalance(address);
                setBalance(bal);
                console.log(`[CALLBACK]${address}`);
              });
            }}
          >
            GetAddress
          </button>
          <QRCode value={qrvalue} size={256} />
          balance:{balance}
          address:{address}
          {nfts.map((card) => (
            <div
              onClick={() => {
                // getCount();
                // setCount();
              }}
              key={`key${card}`}
              className="card 1"
            >
              <div className="card_image">
                <img src="https://i.redd.it/b3esnz5ra34y.jpg" />
              </div>
              <div className="card_title title-white">
                <p>{card}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div></div> */}
    </div>
  );
}

export default App;
