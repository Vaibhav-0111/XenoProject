package com.xenoreach.crm.repository;

import com.xenoreach.crm.entity.Communication;
import com.xenoreach.crm.entity.CommunicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommunicationRepository extends JpaRepository<Communication, Long> {

    List<Communication> findByCampaignId(Long campaignId);

    long countByCampaignIdAndStatus(Long campaignId, CommunicationStatus status);

    long countByCampaignIdAndConvertedTrue(Long campaignId);

    @Query("select c from Communication c where c.campaign.id = :campaignId and c.customer.id = :customerId order by c.id desc")
    Optional<Communication> findTopByCampaignAndCustomer(@Param("campaignId") Long campaignId, @Param("customerId") Long customerId);

    long countByStatus(CommunicationStatus status);

    long countByConvertedTrue();

    long countByCampaignId(Long campaignId);

    @Query("select c.channel as channel, c.status as status, count(c) as cnt " +
           "from Communication c group by c.channel, c.status")
    List<ChannelStatusCount> aggregateByChannelAndStatus();

    interface ChannelStatusCount {
        com.xenoreach.crm.entity.Channel getChannel();
        CommunicationStatus getStatus();
        long getCnt();
    }

    List<Communication> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
