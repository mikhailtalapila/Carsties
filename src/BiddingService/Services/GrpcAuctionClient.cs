using System;
using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;

namespace BiddingService.Services;

public class GrpcAuctionClient
{
    private readonly ILogger<GrpcAuctionClient> _logger;
    private readonly IConfiguration _config;

    public GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }
    public Auction GetAuction(string id)
    {
        _logger.LogInformation("Calling GRPC service");
        var channel = GrpcChannel.ForAddress(_config["GrpcAuction"]);
        var client = new GrpcAuction.GrpcAuctionClient(channel);
        var request = new GetAuctionRequest { Id = id };

        try
        {
            var reply = client.GetAuction(request);
            if (reply == null)
            {
                _logger.LogInformation("*****  reply is null *****");
            }
            else
            {
                _logger.LogInformation("-----------reply is not null ----");
            }
            
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                Seller = reply.Auction.Seller,
                ReservePrice = reply.Auction.ReservePrice
            };
            return auction;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not call GRPC error");
            return null;
        }
    }

}
