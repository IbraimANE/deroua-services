class ProviderModel {
  final String id;
  final String businessName;
  final String category;
  final String phone;
  final String address;
  final String? quartier;
  final double basePrice;
  final String status; // active, verified, pending, rejected
  final bool isOnline;
  final String avatar;
  final String? carteVisite;
  final List<String> portfolio;
  final double rating;
  final int reviewCount;
  final String? workHours;
  final String? bio;

  ProviderModel({
    required this.id,
    required this.businessName,
    required this.category,
    required this.phone,
    required this.address,
    this.quartier,
    this.basePrice = 0.0,
    this.status = 'active',
    this.isOnline = true,
    this.avatar = '',
    this.carteVisite,
    this.portfolio = const [],
    this.rating = 5.0,
    this.reviewCount = 0,
    this.workHours,
    this.bio,
  });

  factory ProviderModel.fromJson(Map<String, dynamic> json) {
    return ProviderModel(
      id: json['id']?.toString() ?? '',
      businessName: json['businessName']?.toString() ?? json['name']?.toString() ?? 'حرفي',
      category: json['category']?.toString() ?? 'كهرباء',
      phone: json['phone']?.toString() ?? '',
      address: json['address']?.toString() ?? 'الدروة',
      quartier: json['quartier']?.toString(),
      basePrice: (json['basePrice'] != null)
          ? double.tryParse(json['basePrice'].toString()) ?? 0.0
          : 0.0,
      status: json['status']?.toString() ?? 'active',
      isOnline: json['isOnline'] == true || json['isOnline'] == 'true',
      avatar: json['avatar']?.toString() ?? '',
      carteVisite: json['carteVisite']?.toString(),
      portfolio: json['portfolio'] is List
          ? List<String>.from(json['portfolio'].map((x) => x.toString()))
          : [],
      rating: (json['rating'] != null)
          ? double.tryParse(json['rating'].toString()) ?? 5.0
          : 5.0,
      reviewCount: (json['reviewCount'] != null)
          ? int.tryParse(json['reviewCount'].toString()) ?? 0
          : 0,
      workHours: json['workHours']?.toString() ?? '8:00 - 20:00',
      bio: json['bio']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'businessName': businessName,
      'category': category,
      'phone': phone,
      'address': address,
      'quartier': quartier,
      'basePrice': basePrice,
      'status': status,
      'isOnline': isOnline,
      'avatar': avatar,
      'carteVisite': carteVisite,
      'portfolio': portfolio,
      'rating': rating,
      'reviewCount': reviewCount,
      'workHours': workHours,
      'bio': bio,
    };
  }

  bool get isVerified => status == 'verified';
}

class ServiceRequestModel {
  final String id;
  final String clientName;
  final String clientPhone;
  final String clientLocation;
  final String providerId;
  final String providerName;
  final String category;
  final String status;
  final String? description;
  final double? rating;
  final String? reviewText;
  final String createdAt;

  ServiceRequestModel({
    required this.id,
    required this.clientName,
    required this.clientPhone,
    required this.clientLocation,
    required this.providerId,
    required this.providerName,
    required this.category,
    this.status = 'Pending',
    this.description,
    this.rating,
    this.reviewText,
    required this.createdAt,
  });

  factory ServiceRequestModel.fromJson(Map<String, dynamic> json) {
    return ServiceRequestModel(
      id: json['id']?.toString() ?? '',
      clientName: json['clientName']?.toString() ?? '',
      clientPhone: json['clientPhone']?.toString() ?? '',
      clientLocation: json['clientLocation']?.toString() ?? '',
      providerId: json['providerId']?.toString() ?? '',
      providerName: json['providerName']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Pending',
      description: json['description']?.toString(),
      rating: json['rating'] != null ? double.tryParse(json['rating'].toString()) : null,
      reviewText: json['reviewText']?.toString(),
      createdAt: json['created']?.toString() ?? json['createdAt']?.toString() ?? 'الآن',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'clientName': clientName,
      'clientPhone': clientPhone,
      'clientLocation': clientLocation,
      'providerId': providerId,
      'providerName': providerName,
      'category': category,
      'status': status,
      'description': description,
    };
  }
}

class DirectoryItemModel {
  final String id;
  final String name;
  final String? nameFr;
  final String category; // emergency, clinic, lab, center
  final String phone;
  final String address;
  final String? googleMapsUrl;
  final String iconEmoji;
  final String? notes;

  DirectoryItemModel({
    required this.id,
    required this.name,
    this.nameFr,
    required this.category,
    required this.phone,
    required this.address,
    this.googleMapsUrl,
    required this.iconEmoji,
    this.notes,
  });

  factory DirectoryItemModel.fromJson(Map<String, dynamic> json) {
    return DirectoryItemModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      nameFr: json['nameFr']?.toString(),
      category: json['category']?.toString() ?? 'emergency',
      phone: json['phone']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      googleMapsUrl: json['googleMapsUrl']?.toString(),
      iconEmoji: json['iconEmoji']?.toString() ?? '📍',
      notes: json['notes']?.toString(),
    );
  }
}
