import { t as prisma } from "./db.js";
//#region src/lib/server/repositories/user.repository.ts
/**
* User Repository
* Handles all database operations for User model
*/
var UserRepository = class {
	/**
	* Find user by email
	*/
	async findByEmail(email) {
		const user = await prisma.user.findUnique({ where: { email } });
		return user ? this.transform(user) : null;
	}
	/**
	* Find user by email with password (for authentication)
	* Returns user with password hash for login verification
	*/
	async findByEmailWithPassword(email) {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return null;
		return {
			...this.transform(user),
			password: user.password
		};
	}
	/**
	* Find user by ID
	*/
	async findById(id) {
		const user = await prisma.user.findUnique({ where: { id } });
		return user ? this.transform(user) : null;
	}
	/**
	* Create new user
	*/
	async create(data) {
		const user = await prisma.user.create({ data: {
			email: data.email,
			password: data.password,
			fullName: data.fullName,
			phone: data.phone,
			country: data.country,
			city: data.city,
			street: data.street,
			postalCode: data.postalCode
		} });
		return this.transform(user);
	}
	/**
	* Update user personal information
	*/
	async update(id, data) {
		const user = await prisma.user.update({
			where: { id },
			data
		});
		return this.transform(user);
	}
	/**
	* Delete user
	*/
	async delete(id) {
		await prisma.user.delete({ where: { id } });
	}
	/**
	* Transform Prisma User to Application User type
	* Removes sensitive fields and ensures consistent structure
	*/
	transform(user) {
		return {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			phone: user.phone,
			country: user.country,
			city: user.city,
			street: user.street,
			postalCode: user.postalCode,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		};
	}
};
var userRepository = new UserRepository();
//#endregion
//#region src/lib/server/repositories/shipment.repository.ts
/**
* Shipment Repository
* Handles all database operations for Shipment model
* Transforms flat DB structure to structured Shipment type (from/to/package/service/options/rate)
*/
var ShipmentRepository = class {
	/**
	* Find shipment by ID (must belong to user)
	*/
	async findById(id, userId) {
		const shipment = await prisma.shipment.findFirst({ where: {
			id,
			userId
		} });
		return shipment ? this.transform(shipment) : null;
	}
	/**
	* Find all shipments for a user with filters
	*/
	async findByUserId(userId, filters) {
		const where = { userId };
		if (filters?.status && filters.status !== "all") where.status = filters.status;
		if (filters?.shipmentType && filters.shipmentType !== "all") where.shipmentType = filters.shipmentType;
		const [shipments, total] = await Promise.all([prisma.shipment.findMany({
			where,
			orderBy: { [filters?.sortBy || "createdAt"]: filters?.sortOrder || "desc" },
			skip: filters?.page ? (filters.page - 1) * (filters.limit || 10) : 0,
			take: filters?.limit || 10
		}), prisma.shipment.count({ where })]);
		return {
			shipments: shipments.map((s) => this.transform(s)),
			total
		};
	}
	/**
	* Create new shipment
	*/
	async create(userId, data, rates) {
		const shipment = await prisma.shipment.create({ data: {
			userId,
			trackingNumber: this.generateTrackingNumber(),
			senderName: data.senderName,
			senderPhone: data.senderPhone,
			senderCountry: data.senderCountry,
			senderCity: data.senderCity,
			senderStreet: data.senderStreet,
			senderPostalCode: data.senderPostalCode,
			receiverName: data.receiverName,
			receiverPhone: data.receiverPhone,
			receiverCountry: data.receiverCountry,
			receiverCity: data.receiverCity,
			receiverStreet: data.receiverStreet,
			receiverPostalCode: data.receiverPostalCode,
			weight: data.weight,
			length: data.length,
			width: data.width,
			height: data.height,
			contentDescription: data.itemDescription || "",
			shipmentType: data.shipmentType || "Domestic",
			serviceType: data.serviceType,
			pickupMethod: data.pickupMethod,
			signatureRequired: data.signatureRequired,
			containsLiquid: data.containsLiquid,
			insurance: data.insurance,
			packaging: data.packaging,
			price: rates.total || 0,
			baseCost: rates.base || 0,
			insuranceCost: rates.insurance || 0,
			signatureCost: rates.signature || 0,
			packagingCost: rates.packaging || 0,
			totalCost: rates.total || 0,
			status: "draft",
			isDraft: true
		} });
		return this.transform(shipment);
	}
	/**
	* Update existing shipment
	*/
	async update(id, userId, data, rates) {
		const shipment = await prisma.shipment.update({
			where: { id },
			data: {
				senderName: data.senderName,
				senderPhone: data.senderPhone,
				senderCountry: data.senderCountry,
				senderCity: data.senderCity,
				senderStreet: data.senderStreet,
				senderPostalCode: data.senderPostalCode,
				receiverName: data.receiverName,
				receiverPhone: data.receiverPhone,
				receiverCountry: data.receiverCountry,
				receiverCity: data.receiverCity,
				receiverStreet: data.receiverStreet,
				receiverPostalCode: data.receiverPostalCode,
				weight: typeof data.weight === "string" ? parseFloat(data.weight) : data.weight,
				length: typeof data.length === "string" ? parseFloat(data.length) : data.length,
				width: typeof data.width === "string" ? parseFloat(data.width) : data.width,
				height: typeof data.height === "string" ? parseFloat(data.height) : data.height,
				contentDescription: data.itemDescription || "",
				shipmentType: data.shipmentType || "Domestic",
				serviceType: data.serviceType,
				pickupMethod: data.pickupMethod,
				signatureRequired: data.signatureRequired,
				containsLiquid: data.containsLiquid,
				insurance: data.insurance,
				packaging: data.packaging,
				price: rates.total || 0,
				baseCost: rates.base || 0,
				insuranceCost: rates.insurance || 0,
				signatureCost: rates.signature || 0,
				packagingCost: rates.packaging || 0,
				totalCost: rates.total || 0
			}
		});
		return this.transform(shipment);
	}
	/**
	* Delete shipment
	*/
	async delete(id, userId) {
		await prisma.shipment.delete({ where: {
			id,
			userId
		} });
	}
	/**
	* Finalize shipment (change status from draft to finalized)
	*/
	async finalize(id, userId) {
		const shipment = await prisma.shipment.update({
			where: {
				id,
				userId
			},
			data: {
				status: "finalized",
				isDraft: false
			}
		});
		return this.transform(shipment);
	}
	/**
	* Transform flat Prisma Shipment to structured Shipment type
	* Converts: flat DB structure → from/to/package/service/options/rate structure
	*/
	transform(db) {
		return {
			id: db.id,
			trackingNumber: db.trackingNumber,
			status: db.status,
			from: {
				name: db.senderName,
				phone: db.senderPhone,
				country: db.senderCountry,
				city: db.senderCity,
				street: db.senderStreet,
				postalCode: db.senderPostalCode
			},
			to: {
				name: db.receiverName,
				phone: db.receiverPhone,
				country: db.receiverCountry,
				city: db.receiverCity,
				street: db.receiverStreet,
				postalCode: db.receiverPostalCode
			},
			package: {
				weight: db.weight,
				length: db.length,
				width: db.width,
				height: db.height,
				description: db.contentDescription
			},
			service: {
				type: db.serviceType,
				shipmentType: db.shipmentType,
				pickupMethod: db.pickupMethod
			},
			options: {
				signature: db.signatureRequired,
				liquid: db.containsLiquid,
				insurance: db.insurance,
				packaging: db.packaging
			},
			rate: {
				base: db.baseCost,
				total: db.totalCost,
				signature: db.signatureCost,
				insurance: db.insuranceCost,
				packaging: db.packagingCost,
				liquid: 0
			},
			createdAt: db.createdAt,
			updatedAt: db.updatedAt
		};
	}
	/**
	* Generate unique tracking number
	* Format: TR + 9 random digits
	*/
	generateTrackingNumber() {
		return "TR" + Math.random().toString().slice(2, 11);
	}
};
var shipmentRepository = new ShipmentRepository();
//#endregion
export { userRepository as n, shipmentRepository as t };
