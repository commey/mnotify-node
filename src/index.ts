import axios, { AxiosResponse } from "axios";
import responses from "./lib/responses";

/** Payload with an `id` field. */
export interface IdentifiablePayload {
	id: number | string;
	[key: string]: unknown;
}

/** Payload with a `group_id` field (used when adding a contact). */
export interface ContactPayload {
	group_id: number | string;
	phone: string;
	title: string;
	firstname: string;
	lastname?: string;
	email?: string;
	dob?: string;
	[key: string]: unknown;
}

/** Generic key-value payload. */
export type Payload = Record<string, unknown>;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * @author Joshua Commey
 * @description Node JS mNotify connector
 * @license MIT License
 * https://github.com/commisol/mnotify
 */
class MNotify {
	private readonly apiKey: string;
	private readonly baseEndpoint: string;

	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error("No API Key provided.");
		}
		/* Enabled API key */
		this.apiKey = apiKey;

		/* Base endpoint */
		this.baseEndpoint = "https://api.mnotify.com/api";
	}

	/**
	 * @description Retrieve all your message templates.
	 */
	async listTemplates(): Promise<unknown> {
		return await this._get("template");
	}

	/**
	 * @description Retrieve a specific message template with templateId as a parameter.
	 */
	async getTemplate(payload: Payload): Promise<unknown> {
		return await this._get("template", payload);
	}

	/**
	 * @param payload
	 * @param payload.title Title of message template
	 * @param payload.content Content of message template
	 * @description Add a message template with data.
	 */
	async addTemplate(payload: Payload): Promise<unknown> {
		return await this._post("template", payload);
	}

	/**
	 * @description Update a Message Template
	 * @param payload
	 * @param payload.id id of message template to update
	 * @param payload.title Title of message template
	 * @param payload.content Content of message template
	 */
	async updateTemplate(payload: Payload): Promise<unknown> {
		return await this._put("template", payload);
	}

	async deleteTemplate(payload: IdentifiablePayload): Promise<unknown> {
		return await this._delete("template", payload);
	}

	async listGroups(): Promise<unknown> {
		return await this._get("group");
	}

	async getGroup(payload: Payload): Promise<unknown> {
		return await this._get("group", payload);
	}

	async addGroup(payload: Payload): Promise<unknown> {
		return await this._post("group", payload);
	}

	async updateGroup(payload: IdentifiablePayload): Promise<unknown> {
		const { id } = payload;
		return await this._put("group/" + id, payload);
	}

	async deleteGroup(payload: IdentifiablePayload): Promise<unknown> {
		return await this._delete("group", payload);
	}

	async listContacts(): Promise<unknown> {
		return await this._get("contact");
	}

	async listGroupContacts(payload: Payload): Promise<unknown> {
		return await this._get("contact/group", payload);
	}

	async getContact(payload: Payload): Promise<unknown> {
		return await this._get("contact", payload);
	}

	/**
	 * @description Add a contact to a group.
	 * @param payload
	 * @param payload.group_id Id of group you want to save contact to (required)
	 * @param payload.phone Phone number of contact (required)
	 * @param payload.title Title of contact eg Mr, Dr, Miss etc (required)
	 * @param payload.firstname First name of contact (required)
	 * @param payload.lastname Last name of contact
	 * @param payload.email Email of contact
	 * @param payload.dob Date of birth of contact in YYYY-MM-DD format
	 */
	async addContact(payload: ContactPayload): Promise<unknown> {
		const { group_id } = payload;
		return await this._post("contact/" + group_id, payload);
	}

	/**
	 * @description Update a specific contact.
	 * @param payload
	 * @param payload.id Contact id to update (required)
	 */
	async updateContact(payload: IdentifiablePayload): Promise<unknown> {
		const { id } = payload;
		return await this._put("contact/" + id, payload);
	}

	/**
	 * @description Delete a specific contact with id and group_id as parameters.
	 * @param payload
	 * @param payload.id id of specified contact
	 * @param payload.group_id id of group which contact belongs to
	 */
	async deleteContact(payload: IdentifiablePayload): Promise<unknown> {
		return await this._delete("contact", payload);
	}

	async sendBulkSMS(payload: Payload): Promise<unknown> {
		return await this._post("sms/quick", payload);
	}

	async sendGroupBulkSMS(payload: Payload): Promise<unknown> {
		return await this._post("sms/group", payload);
	}

	async sendBulkCall(payload: Payload): Promise<unknown> {
		return await this._post("voice/quick", payload);
	}

	async sendGroupBulkVoice(payload: Payload): Promise<unknown> {
		return await this._post("voice/group", payload);
	}

	async registerSenderId(payload: Payload): Promise<unknown> {
		return await this._post("senderid/register", payload);
	}

	async smsBalance(): Promise<unknown> {
		return await this._get("balance/sms");
	}

	async voiceBalance(): Promise<unknown> {
		return await this._get("balance/voice");
	}

	async deliveryReport(payload: Payload): Promise<unknown> {
		return await this._get("campaign", payload);
	}

	async specificDeliveryReport(payload: Payload): Promise<unknown> {
		return await this._get("status", payload);
	}

	async periodicDeliveryReport(payload: Payload): Promise<unknown> {
		return await this._get("report", payload);
	}

	async voiceCallReport(payload: Payload): Promise<unknown> {
		return await this._get("calls", payload);
	}

	async specificVoiceCallReport(payload: Payload): Promise<unknown> {
		return await this._get("call-status", payload);
	}

	/**
	 * @description Retrieves voice call report in between specified dates.
	 * @param payload
	 * @param payload.from Date from in YYYY-MM-DD format
	 * @param payload.to Date to in YYYY-MM-DD format
	 */
	async periodicVoiceCallReport(payload: Payload): Promise<unknown> {
		return await this._get("call-period", payload);
	}

	private async _get(endpoint: string, params?: Payload): Promise<unknown> {
		return await this._request("GET", endpoint, params)
			.then((response) => response.data)
			.catch((e: Error) => {
				throw new Error(e.message);
			});
	}

	private async _post(endpoint: string, params?: Payload): Promise<unknown> {
		return await this._request("POST", endpoint, params)
			.then((response) => response.data)
			.catch((e: Error) => {
				throw new Error(e.message);
			});
	}

	private async _put(endpoint: string, params?: Payload): Promise<unknown> {
		return await this._request("PUT", endpoint, params)
			.then((response) => response.data)
			.catch((e: Error) => {
				throw new Error(e.message);
			});
	}

	private async _delete(endpoint: string, params: IdentifiablePayload): Promise<unknown> {
		const { id } = params;
		return await this._request("DELETE", endpoint + "/" + id, params)
			.then((response) => response.data)
			.catch((e: Error) => {
				throw new Error(e.message);
			});
	}

	private async _request(method: HttpMethod, endpoint: string, payload?: Payload): Promise<AxiosResponse> {
		const mergedPayload = Object.assign({ key: this.apiKey }, payload);

		const url = this.baseEndpoint + "/" + endpoint;
		let request: AxiosResponse;
		switch (method) {
			default:
			case "GET":
				request = await axios.get(url, { params: mergedPayload });
				break;
			case "POST":
				request = await axios.post(url, mergedPayload);
				break;
			case "PUT":
				request = await axios.put(url, mergedPayload);
				break;
			case "DELETE":
				request = await axios.delete(url, { data: mergedPayload });
				break;
		}
		return request;
	}
}

export default MNotify;
export { responses };
