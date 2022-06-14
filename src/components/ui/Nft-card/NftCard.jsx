import React, { useState } from "react";
import { Link } from "react-router-dom";
import { notification } from "antd";
import { login } from "../../../utils";
import "./nft-card.css";
import { utils } from "near-api-js";
import getConfig from "../../../config";
import { Container, Row, Col } from "reactstrap";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Divider, Tag } from "antd";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

const NftCard = (props) => {
	// const { title, id, selling_price, creatorImg, imgUrl, creator, tags, desc } =
	//   props.item;

	let item = props.item;

	const creator = props.item.owner_id;
	const id = props.item.token_id;
	const selling_price = props.item.sale_conditions;
	const using_price = props.item.use_condition;
	const title = props.item.itemData.metadata.title;
	const imgUrl = props.item.itemData.metadata.media;
	const desc = props.item.itemData.metadata.description;
	const is_selling = props.item.is_selling;
	const is_using = props.item.itemData.users;
  const tags = props.item.itemData.metadata.extra;
  
  // const [tags, setTags] = useState([])
  // let tags_raw = props.item.itemData.metadata.extra;
  // const tags = tags_raw.split(", ");
  // let tag1 = tags[0]
  // let tag2 = tags[1]
  // let tag3 = tags[2]
  // setTags(tags_raw);

	const nft_contract_id = nearConfig.nftContractName;

	function handleBuy() {
		submitBuy(item);
	}

	async function submitBuy(item) {
		console.log(item);
		try {
			if (!window.walletConnection.isSignedIn()) return login();
			let nearBalance = await window.account.getAccountBalance();
			if (nearBalance.available < parseInt(item.sale_conditions.amount)) {
				notification["warning"]({
					message: "You dont have enough NEAR",
					description:
						"your account does not have enough NEAR to purchase this item.",
				});

				return;
			}

			await window.contractMarket.offer(
				{
					nft_contract_id: item.nft_contract_id,
					token_id: item.token_id,
				},
				300000000000000,
				// 1
				item.sale_conditions
			);

			console.log("this is it");
		} catch (e) {
			console.log("Error: ", e);
		}
	}

	function handelUse() {
		submitUse(nft_contract_id, id);
	}

	async function submitUse(nft_contract_id, token_id) {
		try {
			await window.contractMarket.apply_use(
				{
					nft_contract_id: nft_contract_id,
					token_id: token_id,
				},
				300000000000000,
				item.use_condition
			);
		} catch (e) {
			console.log("Error: ", e);
		}
	}

	return (
		<div className="single__nft__card" id="nftcard">
			<div className="nft__content ">
				<Row>
					<Col lg="3" style={{ marginRight: 15 }}>
						<img
							src={imgUrl}
							alt="nft thumbnail"
							className="d-inline-flex tw-rounded-full image-shadow tw-w-14 tw-h-14 "
							style={{
								width: 60,
								height: 60,
								borderRadius: "50px",
								marginRight: 20,
							}}
						/>
					</Col>
					<Col>
						<h5 className="nft__title d-inline-flex" style={{ marginBottom: 0}}>
							<Link
								style={{ color: "white", fontSize: 20 }}
								to={`/market/${id}`}
							>
								{title}
							</Link>
						</h5>
            {/* <span>
              <svg style={{marginRight: 0}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 3c-.825 0-1.5.675-1.5 1.5S11.175 6 12 6s1.5-.675 1.5-1.5S12.825 3 12 3zm0 15c-.825 0-1.5.675-1.5 1.5S11.175 21 12 21s1.5-.675 1.5-1.5S12.825 18 12 18zm0-7.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z" fill="rgba(236,240,241,1)"/></svg>
            </span> */}
						<div className="tags" style={{ marginTop: 4 }}>
							<p
								style={{
									display: "inline",
									fontSize: 15,
									color: "#40a9ff",
								}}
							>
								{tags}
							</p>
						</div>
					</Col>
				</Row>

          {/* <div className="d-flex align-items-center gap-1 single__nft-seen" style={{ marginBottom: 8 }}>
            <span>
              <i className="ri-eye-line"></i> 234
            </span>
            <span>
              <i className="ri-heart-line"></i> 123
            </span>
            <span className="justify-content-between">
              <i className="ri-download-fill"></i> 13
            </span>
          </div>
        </div> */}
        
			</div>

			<div id="description" className="contract_des">
				{/* <img src={imgUrl} alt="" className="w-100" /> */}

				<p
					style={{
						height: 150,
						color: "#c7bfbf",
						fontSize: 13,
						textOverflow: "ellipsis",
						overflow: "auto",
						maxHeight: "40ch",
						maxWidth: "40ch",
					}}
				>
					{desc}
				</p>
			</div>

			<p style={{ color: "gray", marginBottom: "0rem", fontSize: 14 }}>
				Owner: {creator}
			</p>

			<div
				className="creator__info-wrapper d-flex gap-3"
				style={{ marginTop: 10 }}
			>
				<div className="creator__info w-100 d-flex align-items-center justify-content-between">
					<div>
						<h6>Selling price</h6>
						<p style={{color: 'orange'}}>
							{utils.format.formatNearAmount(selling_price)}
              <span style={{color:'#b1b3b1'}}> NEAR</span>
						</p>
					</div>
					<div >
						<h6>Using price</h6>
						<p style={{color: 'orange'}}>{utils.format.formatNearAmount(using_price)}
              <span style={{color:'#b1b3b1'}}> NEAR</span>
            </p>
					</div>
				</div>
			</div>

			{!is_selling &&
        (
				<div className=" d-inline-flex align-items-center justify-content-between">
					<button
						className="bid__btn d-flex align-items-center gap-1"
						onClick={handleBuy}
					>
						Buy
					</button>

					{is_using.includes(window.accountId) ? (
						<Tag
							icon={<CheckCircleOutlined />}
							color="success"
							style={{ marginLeft: 130, borderRadius: 15 }}
						>
							Using
						</Tag>
					) : (
						<button
							className="bid__btn d-flex align-items-center gap-1"
							style={{ marginLeft: 120 }}
							onClick={handelUse}
						>
							Use
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default NftCard;
